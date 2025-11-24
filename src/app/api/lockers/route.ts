import { NextRequest } from "next/server";

type Locker = {
    id: string;
    publicName?: { en?: string };
    address?: {
        en?: {
            address?: string;
            postalCode?: string;
            municipality?: string;
        };
    };
    additionalInfo?:{
        en?:string;
    }
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const zipCode = searchParams.get("zipCode");

    if (!provider && !provider?.trim() || !zipCode && !zipCode?.trim()) {
        return new Response(JSON.stringify([]), {
            headers: { "Content-Type": "application/json" },
        });
    }

    let url: string;

    console.log("Fetching lockers for provider:", provider, "and zipCode:", zipCode);

    switch (provider) {
        case "posti":
            url = `http://locationservice.posti.com/location?locationZipCode=${zipCode}&top=10&types=POSTOFFICE&types=SMARTPOST&types=PICKUPPOINT`;
            break;
    }

    try {
        console.log("Fetching lockers from URL:", url);
        const resp = await fetch(url.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        console.log("Response status:", resp.status);

        if (!resp.ok) {
            return new Response(
                JSON.stringify({ error: `Finna error: ${resp.status}` }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        const data = await resp.json();

        //Normalize results
        const result = data.locations?.map((locker: Locker) => {
            const { publicName, address } = locker;
            const addressParts = [
                publicName?.en,
                address?.en?.address,
                address?.en?.postalCode,
                address?.en?.municipality,
                locker.additionalInfo?.en
            ].filter(Boolean);
            
            return {
                id: locker.id,
                name: addressParts.join(", "),
            };
        }) || [];

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ error: "Failed to fetch lockers" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}