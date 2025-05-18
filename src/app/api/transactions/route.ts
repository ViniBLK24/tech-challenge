import { TransactionTypeEnum } from "@/types/transactions";
import { promises as fileSystem } from "fs";
import { NextRequest, NextResponse } from "next/server";
// API route for handling transaction data

// Read file from system (cwd => current working directory)
const FILE_PATH = process.cwd() + "/src/database/db.json"

async function getDbFile(){
    const file = await fileSystem.readFile(FILE_PATH, "utf-8");
    const json = JSON.parse(file);
    return json;
}

export async function GET(){
    const result = await getDbFile();
    return NextResponse.json(result);
}

export async function POST(req: NextRequest){
    const result = await getDbFile();
    const newTransaction = await req.json();

    if(!newTransaction.type || !newTransaction.amount){
        // If any value is empty throw error
        return NextResponse.json({ error: "Preencha todos os campos.", errorCode: 5000 }, {status: 400})
    } else if (!Object.values(TransactionTypeEnum).includes(newTransaction.type)){
        // If transaction type is not valid (based on the enum)
        return NextResponse.json({ error: "Tipo de transferência inválido.", errorCode: 5001 },{status: 400})
    }

    // Append the new transaction to the existing list and add date created and id
    const updatedTransactions = {...result, transactions: [...result.transactions, {id: Date.now(), createdAt: new Date().toISOString(), ...newTransaction}]}
    await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedTransactions))
    return NextResponse.json(updatedTransactions, {status: 200})
}

