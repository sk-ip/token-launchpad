import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export const dynamic = "force-dynamic";

export async function GET(req, res) {
  try {
    const uuid = crypto.randomUUID();
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
            pinJSONToIPFS: true,
          },
        },
      },
      maxUses: 1,
    });

    return NextResponse.json(keyData, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        text: "Error creating api key",
      },
      { status: 500 }
    );
  }
}
