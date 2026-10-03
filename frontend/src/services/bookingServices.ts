import { api } from "@/lib/api";

export interface CreateBookingPayload {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
}

export interface Booking {
    id: string;
    checkIn: string,
    checkOut: string,
    totalPrice: number;
    status: string;
    createAt: string;
    property: {
        id: string;
        title: string;
        location: string;
        pricePerNight: number;
        images: string[];
    };
}

export const createBookingRequest = async (payload: CreateBookingPayload) => {
    //O interceptor já injeta o Bearer token via cookie automaticamente
    const response = await api.post('/bookings', payload);
    return response.data;
};

export const getUserBookingsRequest = async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/me');
    return response.data;
}