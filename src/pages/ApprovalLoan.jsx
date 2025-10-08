import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Stack,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ApprovalWorkflow() {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState("all");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = () => {
        const members = JSON.parse(localStorage.getItem("members") || "[]");
        const allLoans = members.flatMap((m) =>
            (m.loans || []).map((loan) => ({
                ...loan,
                memberId: m.memberId,
                memberName: m.name,
                mobile: m.mobile || "-",
                status: loan.status || "pending",
                repayments: loan.repayments || [],
            }))
        );
        setLoans(allLoans);
    };

    const updateMembersStorage = (updatedLoans) => {
        const members = JSON.parse(localStorage.getItem("members") || "[]");
        const updatedMembers = members.map((m) => ({
            ...m,
            loans: updatedLoans.filter((l) => l.memberId === m.memberId),
        }));
        localStorage.setItem("members", JSON.stringify(updatedMembers));
    };

    // 🟢 Approve Loan & Generate Repayment Schedule
    const handleApprove = () => {
        const updatedLoans = loans.map((loan) => {
            if (loan.loanId === selectedLoanId) {
                const now = new Date();
                const startMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5); // 5th next month

                const repayments = Array.from({ length: loan.tenureMonths }, (_, i) => {
                    const date = new Date(
                        startMonth.getFullYear(),
                        startMonth.getMonth() + i,
                        5
                    );
                    return {
                        date: date.toISOString().split("T")[0],
                        amount: parseFloat(loan.emi),
                        paid: false,
                        paidOn: null, // new field added
                    };
                });

                return {
                    ...loan,
                    status: "approved",
                    repayments,
                    outstanding: parseFloat(loan.totalPayable),
                };
            }
            return loan;
        });

        setLoans(updatedLoans);
        updateMembersStorage(updatedLoans);
        handleClose();
    };

    const handleReject = () => {
        const updatedLoans = loans.map((l) =>
            l.loanId === selectedLoanId ? { ...l, status: "rejected" } : l
        );
        setLoans(updatedLoans);
        updateMembersStorage(updatedLoans);
        handleClose();
    };

    const handleMenuOpen = (event, loanId) => {
        setAnchorEl(event.currentTarget);
        setSelectedLoanId(loanId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedLoanId(null);
    };

    // 🧾 Repayment Handling
    const handleOpenRepayment = (loan) => {
        setSelectedLoan(loan);
        setRepaymentDialogOpen(true);
    };

    const handleMarkPaid = (repayIndex) => {
        const updatedLoans = loans.map((loan) => {
            if (loan.loanId === selectedLoan.loanId) {
                const repayments = [...loan.repayments];
                if (!repayments[repayIndex].paid) {
                    repayments[repayIndex].paid = true;
                    repayments[repayIndex].paidOn = new Date().toISOString().split("T")[0]; // ✅ store date when paid
                }

                const totalPaid = repayments
                    .filter((r) => r.paid)
                    .reduce((sum, r) => sum + r.amount, 0);
                const outstanding = Math.max(
                    parseFloat(loan.totalPayable) - totalPaid,
                    0
                );

                return { ...loan, repayments, outstanding };
            }
            return loan;
        });

        setLoans(updatedLoans);
        updateMembersStorage(updatedLoans);
        loadLoans();
    };

    const handleCloseDialog = () => {
        setRepaymentDialogOpen(false);
        setSelectedLoan(null);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "approved":
                return (
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Approved"
                        color="success"
                        size="small"
                    />
                );
            case "rejected":
                return (
                    <Chip
                        icon={<CancelIcon />}
                        label="Rejected"
                        color="error"
                        size="small"
                    />
                );
            default:
                return (
                    <Chip
                        icon={<PendingActionsIcon />}
                        label="Pending"
                        color="warning"
                        size="small"
                    />
                );
        }
    };

    const filteredLoans =
        filter === "all" ? loans : loans.filter((loan) => loan.status === filter);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Loan Approval Workflow
            </Typography>

            {/* Filter Buttons */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {["all", "pending", "approved", "rejected"].map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "contained" : "outlined"}
                        color={
                            f === "approved"
                                ? "success"
                                : f === "rejected"
                                    ? "error"
                                    : f === "pending"
                                        ? "warning"
                                        : "primary"
                        }
                        onClick={() => setFilter(f)}
                        size="small"
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </Stack>

            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#283593" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Loan ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Member</TableCell>
                            <TableCell sx={{ color: "white" }}>Principal (₹)</TableCell>
                            <TableCell sx={{ color: "white" }}>Interest (%)</TableCell>
                            <TableCell sx={{ color: "white" }}>Tenure</TableCell>
                            <TableCell sx={{ color: "white" }}>EMI (₹)</TableCell>
                            <TableCell sx={{ color: "white" }}>Total Payable (₹)</TableCell>
                            <TableCell sx={{ color: "white" }}>Outstanding (₹)</TableCell>
                            <TableCell sx={{ color: "white" }}>Status</TableCell>
                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    No loan applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLoans.map((loan) => (
                                <TableRow key={loan.loanId}>
                                    <TableCell>{loan.loanId}</TableCell>
                                    <TableCell>{loan.memberName}</TableCell>
                                    <TableCell>₹{loan.principal}</TableCell>
                                    <TableCell>{loan.interest}%</TableCell>
                                    <TableCell>{loan.tenureMonths}</TableCell>
                                    <TableCell>₹{loan.emi}</TableCell>
                                    <TableCell>₹{loan.totalPayable}</TableCell>
                                    <TableCell>
                                        ₹
                                        {loan.outstanding
                                            ? loan.outstanding.toFixed(2)
                                            : loan.totalPayable}
                                    </TableCell>
                                    <TableCell>{getStatusChip(loan.status)}</TableCell>
                                    <TableCell>
                                        {loan.status === "pending" ? (
                                            <>
                                                <IconButton onClick={(e) => handleMenuOpen(e, loan.loanId)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedLoanId === loan.loanId}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleApprove}>Approve</MenuItem>
                                                    <MenuItem onClick={handleReject}>Reject</MenuItem>
                                                </Menu>
                                            </>
                                        ) : loan.status === "approved" ? (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleOpenRepayment(loan)}
                                            >
                                                Manage Repayment
                                            </Button>
                                        ) : (
                                            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                                                No Actions
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* 💰 Repayment Dialog */}
            {selectedLoan && (
                <Dialog open={repaymentDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Repayment Schedule for Loan {selectedLoan.loanId}</DialogTitle>
                    <DialogContent>
                        {selectedLoan.repayments && selectedLoan.repayments.length > 0 ? (
                            selectedLoan.repayments.map((r, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: r.paid ? "#e8f5e9" : "#fffde7",
                                    }}
                                >
                                    <Box>
                                        <Typography>
                                            {r.date} — ₹{r.amount}
                                        </Typography>
                                        {r.paid && r.paidOn && (
                                            <Typography variant="caption" color="text.secondary">
                                                Paid on: {r.paidOn}
                                            </Typography>
                                        )}
                                    </Box>

                                    {r.paid ? (
                                        <Chip label="Paid" color="success" size="small" />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleMarkPaid(index)}
                                        >
                                            Mark Paid
                                        </Button>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography>No repayments found.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}