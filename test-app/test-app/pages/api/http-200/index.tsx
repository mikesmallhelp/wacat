import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    await setTimeout(500);
    res.status(200).json({});
}