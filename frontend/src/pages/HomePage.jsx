import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends } from "../lib/api";

const HomePage = () => {
    const queryClient = useQueryClient();
    const [outgoingRequestsIds, setOutgoingRequestsIds] = useState();

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends
    });

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers
    });

    const { data: outgoingFriendReqs } = useQuery({
        queryKey: ["outgoingFriendReqs"],
        queryFn: getOutgoingFriendReqs
    });

    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
    });


    return <div>HomePage</div>;
}

export default HomePage