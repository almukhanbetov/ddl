package handlers

import (
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"net/http"

	"github.com/google/uuid"
)

const maxImageBytes = 5 << 20 // 5 MB

var allowedImageExt = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/webp": ".webp",
	"image/gif":  ".gif",
}

// savedImage saves one validated multipart image file under
// uploadDir/subdir and returns its public URL path.
type savedImage struct {
	URL  string
	Path string
}

// saveUploadedImage sniffs the real content of fh (ignoring any
// client-supplied filename/content-type), rejects anything that isn't a
// JPEG/PNG/WEBP/GIF or exceeds maxImageBytes, and saves it under a
// random UUID filename in uploadDir/subdir. clientMsg is a safe,
// user-facing validation message set when the upload is rejected for a
// reason the caller should report as 400; err is set only for unexpected
// I/O failures (500).
func saveUploadedImage(fh *multipart.FileHeader, uploadDir, subdir string) (img savedImage, clientMsg string, err error) {
	if fh.Size <= 0 || fh.Size > maxImageBytes {
		return savedImage{}, "размер файла не должен превышать 5 МБ", nil
	}

	src, openErr := fh.Open()
	if openErr != nil {
		return savedImage{}, "не удалось прочитать файл", nil
	}
	defer src.Close()

	sniff := make([]byte, 512)
	n, _ := io.ReadFull(src, sniff)
	contentType := http.DetectContentType(sniff[:n])
	ext, ok := allowedImageExt[contentType]
	if !ok {
		return savedImage{}, "поддерживаются только изображения JPEG, PNG, WEBP, GIF", nil
	}

	if _, err := src.Seek(0, io.SeekStart); err != nil {
		return savedImage{}, "", err
	}

	filename := uuid.New().String() + ext
	destPath := filepath.Join(uploadDir, subdir, filename)
	dest, createErr := os.Create(destPath)
	if createErr != nil {
		return savedImage{}, "", createErr
	}
	defer dest.Close()

	if _, copyErr := io.Copy(dest, src); copyErr != nil {
		os.Remove(destPath)
		return savedImage{}, "", copyErr
	}

	return savedImage{URL: "/uploads/" + subdir + "/" + filename, Path: destPath}, "", nil
}

func cleanupFiles(paths []string) {
	for _, p := range paths {
		_ = os.Remove(p)
	}
}
