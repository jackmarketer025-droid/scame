"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Filter, ShieldAlert, Calendar, Layout, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getFirebase, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const t = useTranslations("Database");
  const { firestore } = getFirebase();

  const filterTags = ["All", "Betting", "Job Fraud", "Phishing", "Investment", "Bank Scam", "Social Media", "SMS", "Phone Call", "Website"];

  const approvedReportsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "reports"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
  }, [firestore]);

  const { data: reports, loading } = useCollection(approvedReportsQuery);

  const filteredScams = useMemo(() => {
    if (!reports) return [];
    return reports.filter(scam => {
      const targetString = String(scam.targetId || "").toLowerCase();
      const typeString = String(scam.scamType || "").toLowerCase();
      const matchesSearch = targetString.includes(searchTerm.toLowerCase()) ||
                           typeString.includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All" || scam.scamType === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [reports, searchTerm, activeFilter]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-headline font-black text-primary">{t("title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="text-xs md:text-sm h-10 md:h-11"><Filter className="w-4 h-4 mr-2" /> {t("filter")}</Button>
            <Button variant="destructive" className="text-xs md:text-sm h-10 md:h-11">{t("realtimeAlert")}</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Input 
              className="h-12 md:h-14 pl-12 text-base md:text-lg rounded-xl border-none shadow-lg"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {filterTags.map((tag) => (
              <Button
                key={tag}
                variant={activeFilter === tag ? "destructive" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(tag)}
                className={`rounded-full px-5 py-1.5 h-auto text-xs font-black uppercase tracking-widest transition-all ${activeFilter === tag ? 'shadow-lg shadow-destructive/20' : 'hover:bg-primary/5'}`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden glass-card">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-primary text-white">
                  <TableRow className="hover:bg-primary border-none">
                    <TableHead className="text-white font-bold whitespace-nowrap"><Calendar className="w-4 h-4 inline mr-2" /> {t("table.date")}</TableHead>
                    <TableHead className="text-white font-bold whitespace-nowrap"><AlertCircle className="w-4 h-4 inline mr-2" /> {t("table.type")}</TableHead>
                    <TableHead className="text-white font-bold whitespace-nowrap"><ShieldAlert className="w-4 h-4 inline mr-2" /> {t("table.target")}</TableHead>
                    <TableHead className="text-white font-bold whitespace-nowrap">{t("table.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {filteredScams.map((scam: any, i) => (
                    <TableRow key={scam.id} className="hover:bg-muted/50 transition-colors group">
                      <TableCell className="font-medium text-muted-foreground whitespace-nowrap">
                        {scam.createdAt ? new Date(scam.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="rounded-md px-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                          {scam.scamType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-primary font-bold whitespace-nowrap">{scam.targetId}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className="flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive border-destructive/20">
                          <AlertCircle className="w-3 h-3" /> Verified Scam
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          {!loading && filteredScams.length === 0 && (
            <div className="p-16 md:p-24 text-center space-y-4 bg-white">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground font-medium">{t("noResults")}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
