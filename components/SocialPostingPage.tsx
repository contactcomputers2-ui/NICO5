
import React, { useState, useRef } from 'react';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import { SocialPost } from '../types';
import UploadIcon from './icons/UploadIcon';
import PhotoIcon from './icons/PhotoIcon';

interface SocialPostingPageProps {
  addSocialPost: (post: Omit<SocialPost, 'id' | 'postedAt'>) => void;
  companyProfile: { name: string; logoUrl: string };
}

const SocialPreview: React.FC<{
  platform: 'facebook' | 'instagram';
  text: string;
  media: File | null;
  profile: { name: string; logoUrl: string };
}> = ({ platform, text, media, profile }) => {
  const mediaUrl = media ? URL.createObjectURL(media) : null;

  const renderContent = () => (
    <>
      <div className="p-4">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{text || "Your post content will appear here..."}</p>
      </div>
      {mediaUrl && (
        <div className="mt-2 bg-gray-200">
          <img src={mediaUrl} alt="Post preview" className="w-full object-cover" />
        </div>
      )}
    </>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-md w-full max-w-md mx-auto">
      <div className="p-3 flex items-center space-x-3 border-b border-gray-200">
        <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="profile" className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <p className="font-semibold text-sm text-gray-900">{profile.name}</p>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            {platform === 'facebook' ? <FacebookIcon className="w-3 h-3 text-blue-600" /> : <InstagramIcon className="w-3 h-3 text-pink-600" />}
            <span>Just now</span>
          </div>
        </div>
      </div>
      {renderContent()}
       <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center font-medium">
         {platform === 'facebook' ? 'Like · Comment · Share' : 'Like · Comment · Send'}
       </div>
    </div>
  );
};


const SocialPostingPage: React.FC<SocialPostingPageProps> = ({ addSocialPost, companyProfile }) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [platforms, setPlatforms] = useState({
    facebook: true,
    instagram: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlatformChange = (platform: 'facebook' | 'instagram') => {
    setPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleMediaUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };
  
  const handlePost = () => {
      const selectedPlatforms = Object.entries(platforms)
        .filter(([_, isSelected]) => isSelected)
        .map(([platform]) => platform as 'facebook' | 'instagram');

      if (selectedPlatforms.length === 0) {
          alert("Please select at least one platform to post to.");
          return;
      }
      if (!text.trim() && !media) {
          alert("Please add some text or media to your post.");
          return;
      }

      addSocialPost({
          platforms: selectedPlatforms,
          text,
          mediaUrl: media ? URL.createObjectURL(media) : undefined,
      });

      alert(`Post published to ${selectedPlatforms.join(' & ')}!`);
      // Reset form
      setText('');
      setMedia(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Social Posting</h1>
        <p className="mt-1 text-sm text-gray-500">Create and publish posts to your connected social media accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Composer */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Platforms</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={platforms.facebook} onChange={() => handlePlatformChange('facebook')} className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"/>
                        <FacebookIcon className="w-6 h-6 text-blue-600"/>
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={platforms.instagram} onChange={() => handlePlatformChange('instagram')} className="h-4 w-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"/>
                        <InstagramIcon className="w-6 h-6 text-pink-600"/>
                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                    </label>
                </div>
            </div>

            <div>
                 <label htmlFor="post-text" className="block text-sm font-medium text-gray-700 mb-2">2. Compose Your Post</label>
                 <textarea
                    id="post-text"
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">3. Add Media (Optional)</label>
                <div className="flex items-center space-x-4">
                     <button
                        onClick={handleMediaUploadClick}
                        className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition-colors"
                     >
                        <UploadIcon className="w-5 h-5 mr-2"/>
                        {media ? 'Change Media' : 'Upload Image/Video'}
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                </div>
                 {media && (
                     <div className="mt-4 flex items-center space-x-3 bg-gray-50 p-2 rounded-md border">
                         <PhotoIcon className="w-5 h-5 text-gray-500"/>
                         <span className="text-sm text-gray-700 truncate">{media.name}</span>
                         <button onClick={() => setMedia(null)} className="ml-auto text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
                     </div>
                 )}
            </div>

            <div className="pt-4 border-t border-gray-200">
                <button
                    onClick={handlePost}
                    disabled={Object.values(platforms).every(p => !p) || (!text.trim() && !media)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Post Now
                </button>
            </div>
        </div>

        {/* Previews */}
        <div className="space-y-6">
           <h3 className="text-lg font-medium text-center text-gray-800">Live Previews</h3>
           {platforms.facebook && <SocialPreview platform="facebook" text={text} media={media} profile={companyProfile} />}
           {platforms.instagram && <SocialPreview platform="instagram" text={text} media={media} profile={companyProfile} />}
           {!platforms.facebook && !platforms.instagram && (
               <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-dashed">
                   Select a platform to see a preview.
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SocialPostingPage;