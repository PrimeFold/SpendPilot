import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import useMediaQuery from "@/hooks/useMediaQuery";
import { Copy } from "lucide-react";

export const ShareLink = ({id}:{id:string})=>{
    const [copied,setCopied] = useState(false);
const isLargeScreen = useMediaQuery(`(min-width:1200px)`)

    const link = `https:/spend-pilot-beta.vercel.app/report/${id}`
    const handleCopy = async()=>{
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(()=>setCopied(false),1000);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Insecure context or browser blocked clipboard access.');
        }
    }

    return(
        <section className="flex flex-row items-center space-x-2 h-13">
            <div className="space-y-4 rounded-lg border border-border w-full background p-3">
                <p className="text-[10px] lowercase tracking-tight text-muted-foreground">
                    {link}
                </p>
            </div>
            {isLargeScreen ? (
                <Button onClick={handleCopy} variant={"default"} size={"lg"} className="uppercase tracking-[0.28em]">
                    {copied ? 'Copied!' : 'Copy'}
                </Button> 
            ) : (
                <Button onClick={handleCopy} variant={"outline"} size={"icon-lg"}>
                    {copied? (
                        <Copy className="h-4 w-4 text-green-400  border-green-400"/>
                    ):(
                        <Copy className="h-4 w-4"/>
                    )}
                </Button>
            )}
        </section>
    )
}
