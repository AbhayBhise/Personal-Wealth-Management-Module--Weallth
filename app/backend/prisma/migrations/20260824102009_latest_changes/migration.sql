-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "client_profiles" ADD COLUMN     "has_hc_proxy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has_poa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has_will" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "document_nodes" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL DEFAULT 'Discover The Wealth Within You',
    "part" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "pages" INTEGER[],
    "is_metadata_only" BOOLEAN NOT NULL,
    "has_content" BOOLEAN NOT NULL,
    "heading_prefix" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_chunks" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL DEFAULT 'Discover The Wealth Within You',
    "part" TEXT,
    "chapter" TEXT,
    "section" TEXT,
    "page_start" INTEGER NOT NULL,
    "page_end" INTEGER NOT NULL,
    "pages" INTEGER[],
    "category" TEXT NOT NULL,
    "secondary_categories" TEXT[],
    "keywords" TEXT[],
    "concepts" TEXT[],
    "entities" TEXT[],
    "content_types" TEXT[],
    "token_count" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "embedding_text" TEXT NOT NULL,
    "embedding" vector(768),
    "previous_chunk_id" TEXT,
    "next_chunk_id" TEXT,
    "hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_vector_chunks" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL DEFAULT 'Discover The Wealth Within You',
    "author" TEXT NOT NULL DEFAULT 'Ric Edelman',
    "part" TEXT,
    "chapter" TEXT,
    "section" TEXT,
    "subsection" TEXT,
    "page_start" INTEGER NOT NULL,
    "page_end" INTEGER NOT NULL,
    "pages" INTEGER[],
    "document_order" INTEGER NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "previous_chunk_id" TEXT,
    "next_chunk_id" TEXT,
    "category" TEXT NOT NULL,
    "keywords" TEXT[],
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "token_count" INTEGER NOT NULL,
    "content_hash" TEXT NOT NULL,
    "parent_doc_id" TEXT NOT NULL,
    "is_summary" BOOLEAN NOT NULL DEFAULT false,
    "summary_level" TEXT NOT NULL DEFAULT 'chunk',
    "embedding_version" TEXT NOT NULL DEFAULT 'gemini-embedding-001',
    "text" TEXT NOT NULL,
    "enriched_context" TEXT,
    "metadata" JSONB,
    "embedding" vector(768),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_vector_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_nodes_book_idx" ON "document_nodes"("book");

-- CreateIndex
CREATE INDEX "document_nodes_part_idx" ON "document_nodes"("part");

-- CreateIndex
CREATE INDEX "document_nodes_chapter_idx" ON "document_nodes"("chapter");

-- CreateIndex
CREATE INDEX "rag_chunks_category_idx" ON "rag_chunks"("category");

-- CreateIndex
CREATE INDEX "rag_chunks_part_idx" ON "rag_chunks"("part");

-- CreateIndex
CREATE INDEX "rag_chunks_chapter_idx" ON "rag_chunks"("chapter");

-- CreateIndex
CREATE INDEX "document_vector_chunks_category_idx" ON "document_vector_chunks"("category");

-- CreateIndex
CREATE INDEX "document_vector_chunks_parent_doc_id_idx" ON "document_vector_chunks"("parent_doc_id");

-- CreateIndex
CREATE INDEX "document_vector_chunks_document_order_idx" ON "document_vector_chunks"("document_order");
