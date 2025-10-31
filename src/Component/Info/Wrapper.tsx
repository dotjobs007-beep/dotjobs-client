"use client";
import { useSearchParams } from "next/navigation";
import DotBullsInfo from "./DotPull";
import PolkadotInfo from "./Polkadot.info";
import HiberbridgeInfo from "./Hiberbridge";

export default function Wrapper (){
    const searchParams = useSearchParams();
    const index = searchParams.get('index');

    if(index === '1'){
        return <PolkadotInfo />
    }

    if (index === '3'){
        return <HiberbridgeInfo />
    }
    return (
        <div>
            <DotBullsInfo />
        </div>
    )
}