"use client";
import { useSearchParams } from "next/navigation";
import DotBullsInfo from "./DotPull";
import PolkadotInfo from "./Polkadot.info";

export default function Wrapper (){
    const searchParams = useSearchParams();
    const index = searchParams.get('index');

    if(index === '1'){
        return <PolkadotInfo />
    }
    return (
        <div>
            <DotBullsInfo />
        </div>
    )
}