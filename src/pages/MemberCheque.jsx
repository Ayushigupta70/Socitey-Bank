import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

function MemberChequeForm() {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        memberId: "",
        chequeNo: "",
        dated: "",
        bankBranch: "",
        amount: "",
    });
    const [cheques, setCheques] = useState([]);

    // Fetch JSON data
    useEffect(() => {
        fetch("/Member.json")
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error loading members:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedMember = members.find(
            (m) => m.memberId === formData.memberId
        );

        const newCheque = {
            ...formData,
            memberName: selectedMember?.name || "Unknown",
        };

        setCheques((prev) => [...prev, newCheque]);
        setFormData({
            memberId: "",
            chequeNo: "",
            dated: "",
            bankBranch: "",
            amount: "",
        });
    };

    return (
        <Box p={3}>
            <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mb: 5 }}>
                <Typography variant="h5" mb={3} align="center">
                    Member Cheque Details Form
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Member Name */}
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Member</InputLabel>
                                <Select
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleChange}
                                    label="Select Member"
                                >
                                    {members.map((member) => (
                                        <MenuItem key={member.memberId} value={member.memberId}>
                                            {member.name} ({member.memberId})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Cheque No */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cheque No"
                                name="chequeNo"
                                value={formData.chequeNo}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Dated */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Dated"
                                name="dated"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.dated}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Bank & Branch */}
                        <Grid item xs={12}>
                            <TextField
                                label="Bank & Branch Name"
                                name="bankBranch"
                                value={formData.bankBranch}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Amount */}
                        <Grid item xs={12}>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12} textAlign="center">
                            <Button type="submit" variant="contained" color="primary">
                                Submit Cheque
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Cheque Table */}
            {cheques.length > 0 && (
                <TableContainer component={Paper}>
                    <Typography variant="h6" align="center" p={2}>
                        Submitted Cheque Details
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Member Name</TableCell>
                                <TableCell>Cheque No</TableCell>
                                <TableCell>Dated</TableCell>
                                <TableCell>Bank & Branch</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cheques.map((ch, i) => (
                                <TableRow key={i}>
                                    <TableCell>{ch.memberName}</TableCell>
                                    <TableCell>{ch.chequeNo}</TableCell>
                                    <TableCell>{ch.dated}</TableCell>
                                    <TableCell>{ch.bankBranch}</TableCell>
                                    <TableCell>₹{ch.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default MemberChequeForm;
