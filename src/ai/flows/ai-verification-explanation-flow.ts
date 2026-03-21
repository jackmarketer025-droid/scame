'use server';
/**
 * @fileOverview This file implements an optimized Genkit flow that performs a security analysis.
 * It now integrates a Firestore lookup to check if the target is already in the community blacklist.
 *
 * - aiVerificationExplanation - The main function for security analysis.
 * - AiVerificationExplanationInput - Input schema for the target.
 * - AiVerificationExplanationOutput - Output schema containing status and details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const AiVerificationExplanationInputSchema = z.object({
  verificationTarget: z.string().describe('The URL or mobile number to analyze.'),
  verificationType: z.enum(['url', 'mobile_number']).describe('The type of target.'),
});
export type AiVerificationExplanationInput = z.infer<typeof AiVerificationExplanationInputSchema>;

const AiVerificationExplanationOutputSchema = z.object({
  status: z.enum(['Safe', 'Suspicious', 'Scam']).describe('The identified safety status.'),
  summaryExplanation: z.string().describe('A short headline explaining the result.'),
  detailedExplanation: z.string().describe('In-depth security analysis of the target.'),
  actionableAdvice: z.array(z.string()).describe('List of steps for the user.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('Numerical risk assessment.'),
  isPreviouslyReported: z.boolean().describe('Whether this target exists in our scam database.'),
});
export type AiVerificationExplanationOutput = z.infer<typeof AiVerificationExplanationOutputSchema>;

const aiVerificationExplanationPrompt = ai.definePrompt({
  name: 'aiVerificationExplanationPrompt',
  input: {
    schema: AiVerificationExplanationInputSchema.extend({
      databaseMatch: z.boolean().optional(),
      communityNotes: z.string().optional(),
    }),
  },
  output: {schema: AiVerificationExplanationOutputSchema},
  prompt: `You are an elite cyber-security analyst specializing in digital fraud prevention in Bangladesh.
Analyze the following {{verificationType}}: "{{{verificationTarget}}}".

CRITICAL CONTEXT:
{{#if databaseMatch}}
- THIS TARGET IS ALREADY IN OUR COMMUNITY BLACKLIST.
- Community Notes: {{{communityNotes}}}
- You MUST mark this as "Scam" and "High" risk.
{{else}}
- No direct matches found in our database. Perform a heuristic analysis.
{{/if}}

Consider common patterns:
- For URLs: Look for domain typos (e.g., g00gle.com), new domain extensions (.xyz, .top), or unofficial banking/MFS clones.
- For Mobile Numbers: Look for common MFS scam prefixes (+8801...), international numbers offering jobs.

Output your response in the following JSON format:
{
  "status": "Safe" | "Suspicious" | "Scam",
  "summaryExplanation": "A punchy headline in Bengali",
  "detailedExplanation": "A technical but understandable explanation in Bengali. Mention community reports if databaseMatch is true.",
  "actionableAdvice": ["Step 1 in Bengali", "Step 2 in Bengali"],
  "riskLevel": "Low" | "Medium" | "High",
  "isPreviouslyReported": {{#if databaseMatch}}true{{else}}false{{/if}}
}

Provide all textual content in Bengali language.
`
});

const aiVerificationExplanationFlow = ai.defineFlow(
  {
    name: 'aiVerificationExplanationFlow',
    inputSchema: AiVerificationExplanationInputSchema,
    outputSchema: AiVerificationExplanationOutputSchema,
  },
  async (input) => {
    // 1. Check Firestore for existing approved reports
    let databaseMatch = false;
    let communityNotes = '';
    
    try {
      const { firestore } = getFirebase();
      if (firestore) {
        const reportsRef = collection(firestore, 'reports');
        const q = query(
          reportsRef, 
          where('targetId', '==', input.verificationTarget),
          where('status', '==', 'approved'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          databaseMatch = true;
          const reportData = querySnapshot.docs[0].data();
          communityNotes = reportData.description || 'Verified scam by community.';
        }
      }
    } catch (e) {
      console.error("Database lookup failed during AI analysis:", e);
    }

    // 2. Call the prompt with DB context
    const {output} = await aiVerificationExplanationPrompt({
      ...input,
      databaseMatch,
      communityNotes
    });
    
    return output!;
  }
);

export async function aiVerificationExplanation(input: AiVerificationExplanationInput): Promise<AiVerificationExplanationOutput> {
  return aiVerificationExplanationFlow(input);
}
