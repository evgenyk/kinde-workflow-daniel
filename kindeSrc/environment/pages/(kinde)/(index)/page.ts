'use server';

export const pageSettings = {};

export default async function handleRequest(event: any) {
    return '<html><body><h1>Page updated something</h1></body></html>';
}
