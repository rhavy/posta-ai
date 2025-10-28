// src/app/comunidade/[id]/types.ts
export interface ViewPostPageProps {
  params: {
    id: string; // vem da URL /comunidade/[id]
  };
  searchParams: {
    page?: string; // opcional, pode vir via query (?page=xxx)
  };
}
