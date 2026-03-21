
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, XCircle, AlertCircle, Loader2, CheckCircle2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, getFirebase, useCollection } from "@/firebase";
import { useRouter } from "@/i18n/routing";
import { signOut } from "firebase/auth";
import { collection, query, where, doc, updateDoc, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const { auth, firestore } = getFirebase();

  const reportsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "reports"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: reports, loading: reportsLoading } = useCollection(reportsQuery);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, userLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setIsProcessing(true);
    const reportRef = doc(firestore, "reports", id);
    
    updateDoc(reportRef, { status: action })
      .then(() => {
        toast({
          title: action === 'approved' ? t("successApprove") : t("successReject"),
          variant: action === 'approved' ? "default" : "destructive",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: reportRef.path,
          operation: 'update',
          requestResourceData: { status: action },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  if (userLoading || (user && reportsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-headline font-black text-primary">{t("title")}</h1>
            <p className="text-muted-foreground font-bold">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" onClick={handleLogout} className="rounded-full font-black border-2 border-primary/10">
               <LogOut className="w-4 h-4 mr-2" /> Logout
             </Button>
             <Badge variant="destructive" className="h-10 px-6 rounded-full font-black animate-pulse shadow-xl shadow-destructive/20">
              SECURE ACCESS
            </Badge>
          </div>
        </div>

        <Card className="border-none shadow-3xl glass-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <AlertCircle className="w-8 h-8 text-destructive" /> {t("pending")} ({reports?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!reports || reports.length === 0 ? (
              <div className="p-20 text-center space-y-6">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto opacity-20" />
                <p className="text-2xl font-black text-muted-foreground opacity-40">{t("noReports")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-black px-8">Target</TableHead>
                      <TableHead className="font-black">Type</TableHead>
                      <TableHead className="font-black">Details</TableHead>
                      <TableHead className="font-black text-right px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report: any) => (
                      <TableRow key={report.id} className="group transition-colors hover:bg-primary/5">
                        <TableCell className="font-mono font-black text-primary px-8">{report.targetId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-black rounded-lg">{report.scamType}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground font-medium">
                          {report.description}
                        </TableCell>
                        <TableCell className="text-right px-8 space-x-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 font-black rounded-xl"
                            onClick={() => handleAction(report.id, 'approved')}
                            disabled={isProcessing}
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> {t("approve")}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="font-black rounded-xl"
                            onClick={() => handleAction(report.id, 'rejected')}
                            disabled={isProcessing}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> {t("reject")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
