import React, { useState } from "react";
import { X, Copy, Check, Crown, Briefcase } from "lucide-react";

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    referralLink: string;
}

export default function ReferralModal({
    isOpen,
    onClose,
    referralLink,
}: ReferralModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-medium">
                        Share Flashfire and earn rewards when friends upgrade!
                    </h2>
                </div>

                <div className="p-8 space-y-8">
                    {/* Reward Tiers */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-green-600">$</span>
                            Refer & Get Paid!
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                    <span className="text-lg font-semibold text-blue-800">
                                        Professional Plan
                                    </span>
                                </div>
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    $20
                                </div>
                                <p className="text-blue-700">
                                    When your friend pays, you earn.
                                </p>
                            </div>
                            <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <Crown className="w-6 h-6 text-orange-600" />
                                    <span className="text-lg font-semibold text-orange-800">
                                        Executive Plan
                                    </span>
                                </div>
                                <div className="text-4xl font-bold text-orange-600 mb-2">
                                    $50
                                </div>
                                <p className="text-orange-700">
                                    When your friend pays, you earn.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Referral Identifier */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Referral Username
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Share this username with friends so they can mention
                            you when they sign up!
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="flex-1 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            * Effective from 11th September
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
