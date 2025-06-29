import React from 'react';

export default function StateLayout({ children }: { children: React.ReactNode }) {    return (
        <div className="flex flex-col flex-1 md:pl-64">
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex h-16 items-center px-4 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Paises</h1>
            </header>    
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
};

