import { Participant } from '@/types';
import { Mic, MicOff, Video, VideoOff, Pin, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useParticipantsStore } from '@/stores/useParticipantsStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface VideoTileProps {
    participant: Participant;
    isActive?: boolean;
    isPinned?: boolean;
    onPin?: () => void;
    className?: string;
}



export default function VideoTile({
    participant,
    isActive,
    isPinned,
    onPin,
    className
}: VideoTileProps) {
    const { updateParticipant } = useParticipantsStore();
    const { user } = useAuthStore();
    const isLocal = participant.id === user?.id || participant.id === 'participant-1'; // fallback logic

    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        // In a real app, only allow muting self or if host.
        // For demo, allowing toggle.
        updateParticipant(participant.id, { isAudioMuted: !participant.isAudioMuted });
    };

    const handleToggleVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateParticipant(participant.id, { isVideoOff: !participant.isVideoOff });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                'flex flex-col aspect-video bg-[#232323] rounded-lg overflow-hidden group min-h-[180px]',
                isPinned && 'ring-2 ring-blue-500',
                className
            )}
        >
            {/* Main Content (Video/Avatar) */}
            <div className="flex-1 flex items-center justify-center relative w-full">
                {participant.isVideoOff ? (
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
                        style={{ backgroundColor: participant.avatar }}
                    >
                        {participant.name.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-500" />
                    </div>
                )}

                {/* Pin Button */}
                {onPin && (
                    <button
                        onClick={onPin}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <Pin className={cn('w-4 h-4', isPinned ? 'text-blue-500' : 'text-white')} />
                    </button>
                )}

                {/* Hand Raised Indicator */}
                {participant.isHandRaised && (
                    <div className="absolute top-2 left-2 p-1.5 bg-yellow-500 rounded-md">
                        <Hand className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            {/* Bottom Info Bar anchored to bottom */}
            <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center justify-between min-w-0 flex-nowrap whitespace-nowrap">
                    <div className="flex items-center gap-2 min-w-0 flex-nowrap">
                        <span className="text-white text-sm font-medium truncate max-w-[70px] min-w-0">
                            {participant.name}
                        </span>
                        {participant.role === 'host' && (
                            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                                Host
                            </span>
                        )}
                        {participant.role === 'co-host' && (
                            <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                                Co-Host
                            </span>
                        )}
                    </div>

                    {/* Interactive Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-nowrap">
                        <button
                            onClick={handleToggleMute}
                            className={cn(
                                "p-1.5 rounded-full transition-colors hover:bg-white/20 flex-shrink-0",
                                participant.isAudioMuted ? "bg-red-500/20 text-red-500" : "text-white"
                            )}
                        >
                            {participant.isAudioMuted ? (
                                <MicOff className="w-4 h-4" />
                            ) : (
                                <Mic className="w-4 h-4" />
                            )}
                        </button>

                        <button
                            onClick={handleToggleVideo}
                            className={cn(
                                "p-1.5 rounded-full transition-colors hover:bg-white/20 flex-shrink-0",
                                participant.isVideoOff ? "bg-red-500/20 text-red-500" : "text-white"
                            )}
                        >
                            {participant.isVideoOff ? (
                                <VideoOff className="w-4 h-4" />
                            ) : (
                                <Video className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
