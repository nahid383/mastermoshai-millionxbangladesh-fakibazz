import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  onUploadSuccess: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName,
  onUploadSuccess,
  size = 'lg',
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getInitials = (name?: string) => {
    if (!name) return '👨‍🎓';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, WebP, or GIF image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique file path using user ID
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onUploadSuccess(publicUrl);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <button
        onClick={handleClick}
        disabled={uploading}
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          sizeClasses[size],
          uploading ? 'cursor-wait' : 'cursor-pointer hover:opacity-90'
        )}
      >
        <Avatar className={cn('w-full h-full rounded-2xl', sizeClasses[size])}>
          <AvatarImage 
            src={currentAvatarUrl || undefined} 
            alt={userName || 'User avatar'}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl rounded-2xl">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay with camera icon */}
        <div className={cn(
          'absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity rounded-2xl',
          uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {uploading ? (
            <Loader2 className={cn('animate-spin text-foreground', iconSizeClasses[size])} />
          ) : (
            <Camera className={cn('text-foreground', iconSizeClasses[size])} />
          )}
        </div>
      </button>
    </div>
  );
};
