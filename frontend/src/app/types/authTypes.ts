

export type LoginFormType = {
    email: string;
    password: string;
}


export type RegisterFormType = {
    username: string;
    email: string
    password: string;
    confirmPassword: string;
}


export type User = {
    id: number;
    username: string;
    email: string;
    created_at: string;
}