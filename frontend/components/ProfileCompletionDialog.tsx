import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { error } from "console";


export default function ProfileCompletionDialog({ userId, onClose }) {
    const [profile, setProfile] = useState({
        bio: "",
        github_url: "",
        linkedin_url: "",
        telegram_url: "",
        profile_picture: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `profile_pictures/${fileName}`;

        setLoading(true);
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            setError("Failed to upload profile picture.");
            setLoading(false);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        setProfile({ ...profile, profile_picture: data.publicUrl });
        setImagePreview(data.publicUrl);
        setLoading(false);
    };

    const handleSubmit = async () => {
        setError("");
        if (!profile.bio || !profile.github_url) {
            setError("Bio and GitHub URL are required.");
            return;
        }

        setLoading(true);
        const { error: updateError } = await supabase
            .from("profiles")
            .update(profile)
            .eq("id", userId);

        setLoading(false);

        if (updateError) {
            setError("Error updating profile.");
        }
    };

    return (
        <div
            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <Label>Bio</Label>
                <Input name="bio" placeholder="Tell us about yourself..." onChange={handleChange} className="mb-3" />

                <Label>GitHub URL</Label>
                <Input name="github_url" placeholder="https://github.com/yourusername" onChange={handleChange} className="mb-3" />

                <Label>LinkedIn URL</Label>
                <Input name="linkedin_url" placeholder="https://linkedin.com/in/yourprofile" onChange={handleChange} className="mb-3" />

                <Label>Telegram Username</Label>
                <Input name="telegram_url" placeholder="@yourusername" onChange={handleChange} className="mb-3" />

                <Label>Profile Picture</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full mx-auto mt-2" />}

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
