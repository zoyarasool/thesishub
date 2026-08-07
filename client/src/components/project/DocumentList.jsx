import { useState, useEffect, useRef } from 'react'
import { FileText, Upload, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProjectDocuments, uploadDocument, deleteDocument } from '../../services/documentService'

const API_BASE = 'http://localhost:5000'

export default function DocumentList({ projectId, canUpload }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchDocuments()
  }, [projectId])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await getProjectDocuments(projectId)
      setDocuments(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('document', file)
    formData.append('projectId', projectId)

    setUploading(true)
    try {
      await uploadDocument(formData)
      toast.success('Document uploaded successfully')
      fetchDocuments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id)
      toast.success('Document removed')
      fetchDocuments()
    } catch (err) {
      toast.error('Failed to delete document')
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(0)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Documents</h2>
        {canUpload && (
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline disabled:opacity-60"
            >
              <Upload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
          No documents uploaded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg shrink-0">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatSize(doc.fileSize)} · {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`${API_BASE}/uploads/${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
                  title="Download"
                >
                  <Download size={16} />
                </a>
                {canUpload && (
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}