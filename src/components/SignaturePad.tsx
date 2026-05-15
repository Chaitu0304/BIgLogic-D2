import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { Eraser } from "lucide-react";

export default function SignaturePad() {
    const sigRef = useRef<any>();

    return (
        <div className="w-full space-y-2">
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 relative group">
                <SignatureCanvas
                    ref={sigRef}
                    penColor="white"
                    canvasProps={{
                        className: "w-full h-[160px] cursor-crosshair active:cursor-crosshair opacity-80 hover:opacity-100 transition-opacity"
                    }}
                    backgroundColor="transparent"
                />

                {/* Floating Clear Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        onClick={() => sigRef.current.clear()}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/5 backdrop-blur-md shadow-lg"
                        title="Clear Signature"
                    >
                        <Eraser size={14} />
                    </Button>
                </div>

                {/* Placeholder text if empty - logically hard to do without state, so just simple overlay label */}
                <div className="absolute bottom-2 left-3 pointer-events-none select-none">
                    <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">Sign Above</span>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={() => sigRef.current.clear()}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-white hover:bg-transparent"
                >
                    <Eraser size={12} className="mr-1.5" /> Clear Signature
                </Button>
            </div>
        </div>
    );
}
