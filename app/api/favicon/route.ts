import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public folder
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["ico", "png", "svg", "jpg", "jpeg"];
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Use .ico, .png, or .svg" },
        { status: 400 },
      );
    }

    // Save as favicon.ico (main) and keep original
    const faviconPath = join(process.cwd(), "public", "favicon.ico");
    const originalPath = join(process.cwd(), "public", `favicon-upload.${ext}`);

    await writeFile(faviconPath, buffer);
    await writeFile(originalPath, buffer);

    return NextResponse.json({
      success: true,
      message: "Favicon updated! Redeploy to see changes.",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
