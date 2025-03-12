'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function SkillsManager({ userId }) {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, [userId]);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('developer_skills')
                .select('*')
                .eq('developer_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            setSkills(data || []);
        } catch (err) {
            console.error('Error fetching skills:', err);
            setError('Failed to load skills. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addSkill = async (e) => {
        e.preventDefault();

        if (!newSkill.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('developer_skills')
                .insert({
                    developer_id: userId,
                    skill: newSkill.trim()
                })
                .select()
                .single();

            if (error) throw error;

            setSkills([...skills, data]);
            setNewSkill('');
        } catch (err) {
            console.error('Error adding skill:', err);
            setError('Failed to add skill. It might already exist in your profile.');
        } finally {
            setLoading(false);
        }
    };

    const removeSkill = async (skillId) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('developer_skills')
                .delete()
                .eq('id', skillId);

            if (error) throw error;

            setSkills(skills.filter(skill => skill.id !== skillId));
        } catch (err) {
            console.error('Error removing skill:', err);
            setError('Failed to remove skill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <form onSubmit={addSkill} className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a new skill (e.g. React, Node.js, UI Design)"
                            className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <Button type="submit" disabled={loading || !newSkill.trim()}>
                            Add
                        </Button>
                    </form>

                    {error && (
                        <p className="mt-2 text-red-500 text-sm">{error}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full"
                        >
                            <span>{skill.skill}</span>
                            <button
                                onClick={() => removeSkill(skill.id)}
                                className="text-primary/70 hover:text-primary"
                                aria-label={`Remove ${skill.skill}`}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}

                    {skills.length === 0 && !loading && (
                        <p className="text-muted-foreground">
                            No skills added yet. Add some skills to showcase your expertise.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 