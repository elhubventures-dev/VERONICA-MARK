import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = env.client.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.server.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new AppError("Supabase Storage is not configured", {
      code: "STORAGE_NOT_CONFIGURED",
      statusCode: 503,
    });
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

export async function createSignedUploadUrl(path: string, expiresIn = 60) {
  const client = getSupabaseAdmin();
  const bucket = env.server.SUPABASE_STORAGE_BUCKET;

  const { data, error } = await client.storage.from(bucket).createSignedUploadUrl(path, {
    upsert: false,
  });

  if (error || !data) {
    throw new AppError(error?.message ?? "Failed to create signed upload URL", {
      code: "STORAGE_SIGNED_UPLOAD_FAILED",
      statusCode: 500,
      details: { path, expiresIn },
    });
  }

  return data;
}

export async function createSignedDownloadUrl(path: string, expiresIn = 3600) {
  const client = getSupabaseAdmin();
  const bucket = env.server.SUPABASE_STORAGE_BUCKET;

  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new AppError(error?.message ?? "Failed to create signed download URL", {
      code: "STORAGE_SIGNED_DOWNLOAD_FAILED",
      statusCode: 500,
      details: { path, expiresIn },
    });
  }

  return data;
}

export async function removeStorageObject(path: string) {
  const client = getSupabaseAdmin();
  const bucket = env.server.SUPABASE_STORAGE_BUCKET;

  const { error } = await client.storage.from(bucket).remove([path]);

  if (error) {
    throw new AppError(error.message, {
      code: "STORAGE_DELETE_FAILED",
      statusCode: 500,
      details: { path },
    });
  }
}
