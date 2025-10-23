"use client";

import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Paper,
    styled,
    Stack
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface MultiImageUploadProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

export default function MultiImageUpload({ 
    files, 
    onFilesChange, 
    maxFiles = 4, 
    disabled = false 
}: MultiImageUploadProps) {
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
        onFilesChange(updatedFiles);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => 
            file.type.startsWith('image/')
        );
        
        const updatedFiles = [...files, ...imageFiles].slice(0, maxFiles);
        onFilesChange(updatedFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        onFilesChange(updatedFiles);
    };

    const moveFile = (fromIndex: number, toIndex: number) => {
        const updatedFiles = [...files];
        const [movedFile] = updatedFiles.splice(fromIndex, 1);
        updatedFiles.splice(toIndex, 0, movedFile);
        onFilesChange(updatedFiles);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box>
            {/* Upload Area */}
            <Paper
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                    p: 3,
                    border: '2px dashed',
                    borderColor: dragOver ? 'primary.main' : 'grey.300',
                    backgroundColor: dragOver ? 'action.hover' : 'background.paper',
                    textAlign: 'center',
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    mb: 2
                }}
            >
                <Button
                    component="label"
                    variant="outlined"
                    disabled={disabled || files.length >= maxFiles}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    {files.length >= maxFiles 
                        ? `Maximum ${maxFiles} images reached`
                        : `Add Images (${files.length}/${maxFiles})`
                    }
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                    />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Drag & drop images here or click to browse
                </Typography>
            </Paper>

            {/* Image List */}
            {files.length > 0 && (
                <Stack spacing={1}>
                    {files.map((file, index) => (
                        <Paper
                            key={`${file.name}-${index}`}
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            {/* Drag Handle */}
                            <DragIndicatorIcon 
                                sx={{ 
                                    color: 'grey.400',
                                    cursor: 'grab',
                                    '&:active': { cursor: 'grabbing' }
                                }} 
                            />
                            
                            {/* File Info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" noWrap>
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(file.size)} • {file.type}
                                </Typography>
                            </Box>

                            {/* Order Number */}
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    minWidth: '20px',
                                    textAlign: 'center'
                                }}
                            >
                                #{index + 1}
                            </Typography>

                            {/* Remove Button */}
                            <IconButton
                                size="small"
                                onClick={() => removeFile(index)}
                                disabled={disabled}
                                sx={{ color: 'error.main' }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
