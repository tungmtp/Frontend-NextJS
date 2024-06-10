'use client'
import { useSearchParams } from "next/navigation";

export default function RequestDetail() {
    const searchParams = useSearchParams();

    return (<div>
        Detail of Request
        <span>{searchParams.get("id")}</span>
        <br />
        <span>{searchParams.get("mdate")}</span>
    </div>)
}