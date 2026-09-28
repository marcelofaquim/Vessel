'use client';

import { useAuth } from "@/contexts/AuthContext";

export default function DashbardPage() {
    const { user, signOut } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-50 p-8">
           <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
               <div className="flex items-center justify-between border-b pb-4">
                  <h1 className="text-2xl font-bold text-gray-800">Painel Vessel</h1>
                  <button
                    onClick={signOut}
                    className="rounded bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600">
                        Sair    
                    </button>
                </div> 

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-700">Bem-Vido(a)</h2>
                    <p className="mt-1 text-sm text-gray-500">E-mail: {user?.email}</p>
                    <p className="mt-1 text-sm text-gray-500">Função: {user?.role}</p>
                </div>
                
                <div className="mt-8 rounded-md bg-blue-50 p-4 border border-blue-200 text-blue-800">
                   <p className="text-sm font-medium">
                        ✅ Autenticação concluída com sucesso!
                    </p> 
                </div>

            </div> 
        </div>
    )
}