"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { fetchApi } from "@/lib/api-client";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, BookOpen, GraduationCap, Clock, User } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [allSkills, setAllSkills] = useState<any[]>([]);

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedTeachIds, setSelectedTeachIds] = useState<string[]>([]);
  const [selectedLearnIds, setSelectedLearnIds] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [availability, setAvailability] = useState("Flexible");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApi("/skills")
      .then((data) => setAllSkills(data))
      .catch(() => {});

    if (user) {
      if (user.bio) setBio(user.bio);
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  ];

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          bio,
          avatar_url: avatarUrl || avatarPresets[0],
          experience_level: experienceLevel,
          availability: availability,
          teach_skill_ids: selectedTeachIds,
          learn_skill_ids: selectedLearnIds,
        }),
      });
      await refreshUser();
      setStep(6); // Summary screen
    } catch (err) {
      console.error("Onboarding failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTeachSkill = (id: string) => {
    setSelectedTeachIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleLearnSkill = (id: string) => {
    setSelectedLearnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 border border-[#2E1A5E]/10 shadow-xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <Logo size="md" />
          <div className="text-xs font-bold text-[#E36648]">
            Step {Math.min(step, 5)} of 5
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#2E1A5E] to-[#E36648] h-full transition-all duration-300"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: Personal Bio & Avatar */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#161F30]">Tell us about yourself</h3>
              <p className="text-xs text-gray-500 mt-1">Setup your public profile details.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-2">Choose Avatar</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {avatarPresets.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Preset"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-14 h-14 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      avatarUrl === url ? "border-[#E36648] scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">Your Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, passions, and what you'd love to exchange..."
                className="w-full p-4 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-2xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: What can you teach? */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#161F30]">What can you teach?</h3>
              <p className="text-xs text-gray-500 mt-1">Select the skills you feel confident sharing with others.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {allSkills.map((s) => {
                const isSelected = selectedTeachIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleTeachSkill(s.id)}
                    className={`p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#2E1A5E] text-[#FFF8F0] border-[#2E1A5E]"
                        : "bg-[#FFF8F0] text-[#161F30] border-[#2E1A5E]/15 hover:border-[#2E1A5E]/40"
                    }`}
                  >
                    <span>{s.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E36648] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: What do you want to learn? */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#161F30]">What do you want to learn?</h3>
              <p className="text-xs text-gray-500 mt-1">Select skills you are eager to master.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {allSkills.map((s) => {
                const isSelected = selectedLearnIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleLearnSkill(s.id)}
                    className={`p-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#E36648] text-[#FFF8F0] border-[#E36648]"
                        : "bg-[#FFF8F0] text-[#161F30] border-[#E36648]/20 hover:border-[#E36648]/60"
                    }`}
                  >
                    <span>{s.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FFF8F0] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Experience Level */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#161F30]">What&apos;s your experience level?</h3>
              <p className="text-xs text-gray-500 mt-1">Helps us match you with compatible exchange partners.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["Beginner", "Intermediate", "Advanced", "Expert"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    experienceLevel === lvl
                      ? "bg-[#2E1A5E] text-[#FFF8F0] border-[#2E1A5E] shadow-md"
                      : "bg-[#FFF8F0] text-[#161F30] border-[#2E1A5E]/15 hover:border-[#2E1A5E]"
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mx-auto mb-2 text-[#E36648]" />
                  <span className="font-bold text-sm">{lvl}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Availability */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#161F30]">What&apos;s your availability?</h3>
              <p className="text-xs text-gray-500 mt-1">When are you available for exchange sessions?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["Weekdays", "Weekends", "Evenings", "Flexible"].map((avail) => (
                <button
                  key={avail}
                  type="button"
                  onClick={() => setAvailability(avail)}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    availability === avail
                      ? "bg-[#E36648] text-[#FFF8F0] border-[#E36648] shadow-md"
                      : "bg-[#FFF8F0] text-[#161F30] border-[#E36648]/20 hover:border-[#E36648]"
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2 text-[#FFF8F0]" />
                  <span className="font-bold text-sm">{avail}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FINISH STEP 6: Summary Screen */}
        {step === 6 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#E36648]/10 text-[#E36648] flex items-center justify-center animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-black text-[#161F30]">Your Skill X Change profile is ready!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Our reciprocal matching algorithm has calculated your initial match recommendations based on your skills.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-base rounded-2xl hover:bg-[#291A53] shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 text-[#E36648]" />
            </button>
          </div>
        )}

        {/* Footer Buttons */}
        {step <= 5 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-xs font-bold text-[#2E1A5E] hover:bg-[#2E1A5E]/5 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-xs rounded-xl hover:bg-[#291A53] flex items-center gap-1 shadow-sm"
              >
                Next
                <ArrowRight className="w-4 h-4 text-[#E36648]" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="px-8 py-3 bg-[#E36648] text-[#FFF8F0] font-bold text-xs rounded-xl hover:opacity-90 flex items-center gap-1 shadow-md"
              >
                {submitting ? "Saving..." : "Finish Onboarding"}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
