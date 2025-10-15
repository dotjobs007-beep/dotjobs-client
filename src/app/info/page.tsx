import { Suspense } from "react";
import Wrapper from "@/Component/Info/Wrapper";

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Wrapper />
        </Suspense>
    );
}