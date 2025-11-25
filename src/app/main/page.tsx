import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs";
import { Header } from "@/components/Header";
import PrintRequestForm from "@/components/PrintRequestForm";
import BookSearch from "@/components/BookSearch";
import { Printer, Search as SearchIcon } from "lucide-react";

export default function MainPage() {

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                
                <Tabs defaultValue="print" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                        <TabsTrigger value="print" className="flex items-center gap-2">
                            <Printer className="w-4 h-4" />
                            Print Order
                        </TabsTrigger>
                        <TabsTrigger value="search" className="flex items-center gap-2">
                            <SearchIcon className="w-4 h-4" />
                            Book Search
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="search">
                        <BookSearch />
                    </TabsContent>
                    <TabsContent value="print">
                        <PrintRequestForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}