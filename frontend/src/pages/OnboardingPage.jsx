import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, LoaderIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { createAvatar } from '@dicebear/core';
import { loreleiNeutral } from '@dicebear/collection';

const OnboardingPage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState(() => {
        let initialProfilePic = authUser?.profilePic || "";

        if (!initialProfilePic) {
            const seed = Math.random().toString(36).substring(7);
            initialProfilePic = createAvatar(loreleiNeutral, { seed }).toDataUri();
        }

        return {
            fullName: authUser?.fullName || "",
            bio: authUser?.bio || "",
            profilePic: initialProfilePic
        };
    });

    const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },

        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onboardingMutation(formState);
    };

    const handleRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const avatar = createAvatar(loreleiNeutral, {
            seed: seed,
        });

        const randomAvatar = avatar.toDataUri();

        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success("Random profile picture generated!");
    };

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {formState.profilePic ? (
                                    <img
                                        src={formState.profilePic}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <CameraIcon className="size-12 text-base-content opacity-40" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                                    <ShuffleIcon className="size-4 mr-2" />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formState.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Tell others about yourself"
                            />
                        </div>

                        <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                            {!isPending ? (
                                <>
                                    <ShipWheelIcon className="size-5 mr-2" />
                                    Complete Onboarding
                                </>
                            ) : (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Onboarding...
                                </>
                            )}
                        </button>


                    </form>

                </div>
            </div>

        </div>
    );
}

export default OnboardingPage;