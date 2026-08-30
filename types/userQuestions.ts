export interface UserSubmittedQuestion {
    id: string;
    formatId: string | null;
    formatTitle: string | null;
    categoryText: string;
    questionText: string;
    visibility: "private" | "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserQuestionInput {
    formatId: string | null;
    categoryText: string;
    questionText: string;
    shareWithApplicants: boolean;
}

export interface CreateUserQuestionResponse {
    id: string;
    userId: string;
    formatId: string | null;
    categoryText: string;
    questionText: string;
    visibility: "private" | "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}