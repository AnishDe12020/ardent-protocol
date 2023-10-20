import { randomBytes } from "crypto"
import { useCallback, useState } from "react"
import { FilePlus, UploadIcon } from "lucide-react"
import { NFTStorage } from "nft.storage"
import { FileRejection, useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { Icons } from "./icons"
import { Button } from "./ui/button"

const MAX_FILE_SIZE = 15728640

const Upload = ({
  onChange,
  value,
}: {
  onChange: (data: string) => void
  value: string
}) => {
  const [data, setData] = useState<string>("")

  const [isReadingFile, setIsReadingFile] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const onDropAccepted = useCallback(
    (files: File[]) => {
      setIsReadingFile(true)
      const file = files[0]
      const reader = new FileReader()
      reader.onerror = () => {
        toast.error("Something went wrong when reading the file")
        setIsReadingFile(false)
      }

      reader.onload = () => {
        console.log(reader.result)
        setData(reader.result as string)
        toast.success("File read")
        setIsReadingFile(false)
      }

      reader.readAsArrayBuffer(file)
    },
    [setData, setIsReadingFile]
  )

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errorMessage =
      fileRejections.length > 1
        ? "You can only select 1 file"
        : fileRejections[0].file.size > MAX_FILE_SIZE
        ? "File is too big"
        : "Unknown error"

    toast.error(errorMessage)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDropRejected,
    onDropAccepted,
    maxSize: MAX_FILE_SIZE,
  })

  const handleUpload = async () => {
    setIsUploading(true)

    try {
      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!,
      })

      const cid = await client.storeBlob(
        new Blob([data], { type: "image/png" })
      )

      console.log(cid)

      toast.success("File uploaded", {
        action: {
          label: "Open URL",
          onClick: () => window.open(`https://ipfs.io/ipfs/${cid}`),
        },
      })
      onChange(`https://ipfs.io/ipfs/${cid}`)
    } catch (err) {
      console.error(err)
      toast.error("Error uploading file")
      setIsUploading(false)
    }

    setIsUploading(false)
  }

  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <div
        className="flex flex-col gap-4 bg-secondary rounded-xl p-4 border border-dashed border-slate-500"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {data ? (
          <img
            src={`data:image/png;base64,${Buffer.from(data).toString(
              "base64"
            )}`}
            alt="file"
          />
        ) : (
          <>
            <FilePlus className="w-10 h-10" />
            {isReadingFile ? (
              <Icons.spinner className="w-10 h-10 animate-spin" />
            ) : isDragActive ? (
              <p>Drop here</p>
            ) : (
              <>
                <p>Drag and drop the file here, or click to select a file</p>
                <p>Max file size: 15MB</p>
              </>
            )}
          </>
        )}
      </div>
      <Button
        onClick={handleUpload}
        isLoading={isUploading}
        disabled={!data || !!value}
        type="button"
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        <span>{value ? "Uploaded" : "Upload"}</span>
      </Button>
    </div>
  )
}

export default Upload
