import React, { useState } from 'react';
import { Star, Trash2, RefreshCw, Upload, Check, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Image as ImageIcon, X } from 'lucide-react';

export default function VehiclePhotoManager({ vehicle, images = [], onUpdateImages }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Allowed photo types
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 5;

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast('error', `Rejected ${file.name}: Only JPG, PNG, and WEBP images are supported.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast('error', `Rejected ${file.name}: File size exceeds maximum 5MB limit.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (!selectedFiles.length) return;
    setIsUploading(true);

    try {
      // Simulate / perform upload
      const newImages = selectedFiles.map((file, idx) => ({
        id: Date.now() + idx,
        imageUrl: previews[idx],
        isPrimary: images.length === 0 && idx === 0,
        displayOrder: images.length + idx + 1
      }));

      const updatedList = [...images, ...newImages];
      onUpdateImages(updatedList);
      
      setSelectedFiles([]);
      setPreviews([]);
      showToast('success', `${newImages.length} photo(s) uploaded successfully!`);
    } catch (err) {
      showToast('error', 'Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = (imageId) => {
    const updated = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onUpdateImages(updated);
    showToast('success', 'Primary photo updated!');
  };

  const handleReplaceImage = (imageId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('error', 'Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    const newUrl = URL.createObjectURL(file);
    const updated = images.map(img => img.id === imageId ? { ...img, imageUrl: newUrl } : img);
    onUpdateImages(updated);
    showToast('success', 'Photo replaced successfully!');
  };

  const handleReorder = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const list = [...images];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update display orders
    const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    onUpdateImages(reordered);
  };

  const handleDeleteImage = (imageId) => {
    const remaining = images.filter(img => img.id !== imageId);
    const deletedWasPrimary = images.find(img => img.id === imageId)?.isPrimary;

    if (deletedWasPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }

    onUpdateImages(remaining);
    setDeleteConfirmId(null);
    showToast('success', 'Photo deleted successfully.');
  };

  return (
    <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E2E8F0' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color="#FFB800" /> Vehicle Photos Management
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Manage gallery photos. Select one primary photo to represent {vehicle?.brand} {vehicle?.model} throughout the platform.
          </p>
        </div>
        <span className="badge badge-category">{images.length} Photos</span>
      </div>

      {/* Toast Alert Message */}
      {statusMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: statusMessage.type === 'success' ? '#059669' : '#DC2626',
          border: `1px solid ${statusMessage.type === 'success' ? '#10B981' : '#EF4444'}`
        }}>
          {statusMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {statusMessage.text}
        </div>
      )}

      {/* Existing Photos Gallery Grid */}
      {images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '10px', color: '#64748B', marginBottom: '1.5rem' }}>
          No vehicle photos uploaded yet. Use the upload area below to add photos.
        </div>
      ) : (
        <div className="grid-3" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
          {images.map((img, idx) => (
            <div 
              key={img.id}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: img.isPrimary ? '3px solid #FFB800' : '1px solid #CBD5E1',
                boxShadow: img.isPrimary ? '0 4px 15px rgba(255, 184, 0, 0.3)' : 'none',
                backgroundColor: '#F8FAFC'
              }}
            >
              {/* Primary Badge */}
              {img.isPrimary && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#FFB800',
                  color: '#000',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  zIndex: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  <Star size={13} fill="#000" /> PRIMARY PHOTO
                </div>
              )}

              {/* Photo Image */}
              <img 
                src={img.imageUrl} 
                alt={`Vehicle Photo ${idx + 1}`} 
                style={{ width: '100%', height: '170px', objectFit: 'cover' }}
              />

              {/* Action Toolbar */}
              <div style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {!img.isPrimary && (
                    <button 
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      className="btn btn-outline btn-sm"
                      title="Set as Primary Photo"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
                    >
                      <Star size={13} color="#FFB800" /> Primary
                    </button>
                  )}

                  {/* Replace File Input */}
                  <label className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', margin: 0 }}>
                    <RefreshCw size={13} /> Replace
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleReplaceImage(img.id, e)} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Reorder & Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {idx > 0 && (
                    <button type="button" onClick={() => handleReorder(idx, 'left')} className="btn btn-outline btn-sm" style={{ padding: '0.3rem' }} title="Move Left">
                      <ArrowLeft size={13} />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button type="button" onClick={() => handleReorder(idx, 'right')} className="btn btn-outline btn-sm" style={{ padding: '0.3rem' }} title="Move Right">
                      <ArrowRight size={13} />
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => setDeleteConfirmId(img.id)}
                    className="btn btn-secondary btn-sm" 
                    style={{ padding: '0.3rem', color: '#EF4444' }} 
                    title="Delete Photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Photos Zone */}
      <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
        <Upload size={32} color="#FFB800" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '0.98rem', color: '#0F172A', marginBottom: '0.25rem' }}>Upload Additional Vehicle Photos</h4>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
          Supports JPG, JPEG, PNG, WEBP files up to 5MB each.
        </p>

        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
          Browse & Select Files
          <input 
            type="file" 
            multiple 
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect} 
            style={{ display: 'none' }}
          />
        </label>

        {/* Selected File Previews Before Upload */}
        {previews.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
            <h5 style={{ fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.75rem' }}>Selected Photos Preview ({previews.length}):</h5>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  <button 
                    type="button" 
                    onClick={() => removePreview(i)} 
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={handleUploadSubmit} 
              disabled={isUploading}
              className="btn btn-primary"
            >
              {isUploading ? 'Uploading Photos...' : `Upload ${previews.length} Photo(s)`}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '1.5rem', textAlign: 'center' }}>
            <AlertCircle size={40} color="#EF4444" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem' }}>Delete Vehicle Photo?</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Are you sure you want to delete this photo? If this was the primary photo, another photo will automatically be selected as primary.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleDeleteImage(deleteConfirmId)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#EF4444', color: '#FFF' }}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
