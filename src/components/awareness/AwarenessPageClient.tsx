"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Download,
  FileText,
  CheckCircle,
  ExternalLink,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useTranslations } from "next-intl";
import { getFirebase } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function AwarenessPageClient() {
  const t = useTranslations("Awareness");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { firestore } = getFirebase();
        const q = query(
          collection(firestore, "awareness_resources"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch awareness resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloads = [0, 1, 2].map((idx) => ({
    title: t(`downloads.${idx}.title`),
    size: t(`downloads.${idx}.size`),
  }));

  const rules = [0, 1, 2].map((idx) => t(`rules.${idx}`));

  if (loading) {
    return <div className="text-center py-20">লোড হচ্ছে...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-black text-primary">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> {t("blogTitle")}
            </h2>
            <div className="grid gap-6">
              {resources.map((res, i) => (
                <Card
                  key={i}
                  className="group hover:shadow-xl transition-all border-none shadow-md overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-48 h-48">
                    <Image
                      src={PlaceHolderImages[i % PlaceHolderImages.length].imageUrl}
                      alt={res.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-destructive uppercase tracking-widest">
                        {res.date}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {res.desc}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-bold text-primary"
                    >
                      {t("readMore")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Download className="w-6 h-6" /> {t("downloadTitle")}
            </h2>
            <div className="space-y-4">
              {downloads.map((dl, i) => (
                <Card
                  key={i}
                  className="border-none shadow-md hover:bg-muted/30 transition-colors"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{dl.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {dl.size}
                      </p>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Download className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary text-white border-none shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <Shield className="w-12 h-12 text-destructive" />
                <h3 className="text-2xl font-bold leading-tight">
                  {t("goldenRules")}
                </h3>
                <ul className="space-y-4">
                  {rules.map((text, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-destructive shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
