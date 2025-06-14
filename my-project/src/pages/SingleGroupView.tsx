import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import getCurrentUserId from "../utils/getCurrentUserId";

const SingleGroupView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate("/login");
      return;
    }
    setCurrentUserId(Number(userId));
    fetchCurrentUser(userId);
    fetchGroup();
  }, []);

  const fetchCurrentUser = async (id: string) => {
    try {
      const res = await api.get(`/users/${id}`);
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user;", err);
    }
  };

  const fetchGroup = async () => {
    try {
      const groupRes = await api.get(`/groups/${id}`);
      setGroup(groupRes.data);

      const listingRes = await api.get(`/listings/${groupRes.data.listing_id}`);
      setListing(listingRes.data);

      const ownerRes = await api.get(`/users/${groupRes.data.owner_id}`);
      setOwnerInfo(ownerRes.data);
    } catch (err) {
      console.error("Failed to fetch group or listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroupAndOwner = async () => {
    if (!group?.group_id || !ownerInfo?.user_id) return;
    const confirmed = window.confirm("Are you sure that you want to delete this group and its owner?");
    if (!confirmed) return;

    try {
      await api.delete(`/groups/${group.group_id}`);
      await api.delete(`/users/${ownerInfo.user_id}`);
      alert("Group and owner deleted successfully.");
      navigate("/groups");
    } catch (err) {
      console.error("Failed to delete group and owner;", err);
      alert("Failed to delete group and owner...");
    }
  };

  const handleDeleteGroup = async () => {
    const confirmed = window.confirm("Are you sure that you want to delete this group?");
    if (!confirmed) return;

    try {
      await api.delete(`/groups/${group.group_id}`);
      alert("Group deleted successfully....");
      navigate("/groups");
    } catch (err) {
      console.error("Failed to delete group:", err);
      alert("Failed to delete the group...");
    }
  };

  const handleJoinRequest = async () => {
    try {
      await api.post(`/groups/${group.group_id}/join-request`);
      alert("Join request sent successfully.");
      fetchGroup();
    } catch (err: any) {
      const message = err?.response?.data?.detail;
      if (message === "You have already sent a join request.") {
        alert("You've already requested to join this group.");
      } else if (message === "You are already a member of this group.") {
        alert("You're already a member of this group.");
      } else {
        alert("Failed to send join request.");
      }
      console.error("Join request failed:", err);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      await api.post(`/groups/${group.group_id}/approve-member`, { user_id: userId });
      alert("Member approved!");
      fetchGroup();
    } catch (err) {
      console.error(err);
      alert("Failed to approve member");
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await api.post(`/groups/${group.group_id}/reject-member`, { user_id: userId });
      alert("Request rejected!");
      fetchGroup();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

  const handleRemove = async (userId: number) => {
    try {
      await api.delete(`/groups/${group.group_id}/remove-member`, {
        data: { user_id: userId },
      });
      alert("Member removed!");
      fetchGroup();
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  const handleLeaveGroup = async () => {
    const confirmed = window.confirm("Are you sure you want to leave this group?");
    if (!confirmed) return;

    try {
      await api.delete(`/groups/${group.group_id}/leave`);
      alert("You have left the group.");
      navigate("/groups");
    } catch (err) {
      console.error("Failed to leave group:", err);
      alert("Failed to leave the group.");
    }
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <Typography>Group not found</Typography>
      </Box>
    );
  }

  const pendingMembers = group.members?.filter((m: any) => m.status === "pending") || [];
  const activeMembers = group.members?.filter((m: any) => m.status === "active") || [];
  const isOwner = group?.owner_id === currentUserId;
  const isAdmin = currentUser?.role === "admin";
  const isMember = activeMembers.some((m: any) => m.user_id === currentUserId);
  const isPending = pendingMembers.some((m: any) => m.user_id === currentUserId);
  const canDelete = isAdmin || isOwner;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url("/assets/home.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        px: 2,
      }}
    >
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>{group.name}</Typography>
          <Typography variant="body1" gutterBottom>{group.description || "No description provided."}</Typography>

          {ownerInfo && (
            <Box mt={2}>
              <Typography variant="subtitle1"><strong>Group Leader:</strong> {ownerInfo.name} {ownerInfo.surname}</Typography>
              <Typography variant="subtitle2"><strong>Email:</strong> {ownerInfo.email || "N/A"}</Typography>
              <Typography variant="subtitle2"><strong>Phone:</strong> {ownerInfo.phone_number || "N/A"}</Typography>
            </Box>
          )}

          {!isOwner && !isMember && !isPending && (
            <Box mt={2}>
              <Button variant="contained" onClick={handleJoinRequest}>
                Request to Join Group
              </Button>
            </Box>
          )}

          {isPending && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Your request is pending approval.
              </Typography>
            </Box>
          )}

          {isMember && !isOwner && (
            <Box mt={2}>
              <Button variant="outlined" color="error" onClick={handleLeaveGroup}>
                Leave Group
              </Button>
            </Box>
          )}

          {(isOwner || isAdmin) && (
            <Box mt={4}>
              <Typography variant="h6">Pending Join Requests:</Typography>
              {pendingMembers.length === 0 ? (
                <Typography>No pending requests.</Typography>
              ) : (
                pendingMembers.map((member: any) => (
                  <Box key={member.user_id} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography>{member.name} {member.surname} (@{member.username})</Typography>
                    <Box>
                      <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => handleApprove(member.user_id)}>Approve</Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleReject(member.user_id)}>Reject</Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}

          <Box mt={4}>
            <Typography variant="h6">Current Members:</Typography>
            {activeMembers.length === 0 ? (
              <Typography>No members yet.</Typography>
            ) : (
              activeMembers.map((member: any) => (
                <Box key={member.user_id} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography>{member.name} {member.surname} (@{member.username})</Typography>
                  {isOwner && member.user_id !== currentUserId && (
                    <Button variant="outlined" size="small" color="error" onClick={() => handleRemove(member.user_id)}>
                      Remove
                    </Button>
                  )}
                </Box>
              ))
            )}
          </Box>

          {canDelete && (
            <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
              <Button variant="contained" color="error" onClick={handleDeleteGroup}>
                Delete Group
              </Button>
              {isAdmin && (
                <Button variant="outlined" color="error" onClick={handleDeleteGroupAndOwner}>
                  Delete owner
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SingleGroupView;
