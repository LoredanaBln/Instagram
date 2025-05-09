import React, { useEffect, useState } from 'react';

type FutureLoaderProps<T> = {
    future: () => Promise<T>;
    children: (data: T) => JSX.Element;
    fallback?: JSX.Element;
    errorComponent?: (error: any) => JSX.Element;
};

export function FutureLoader<T>({
        future,
        children,
        fallback = <div>Loading...</div>,
        errorComponent,
    }: FutureLoaderProps<T>) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        future()
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return fallback;
    if (error) return errorComponent ? errorComponent(error) : <div>Error loading data.</div>;
    return children(data!);
}
