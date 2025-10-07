import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Container,
    Paper,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

export default function CaseFormDetail() {
    const [activeForm, setActiveForm] = useState("138");

    // Section 138 Case Form State
    const [form138, setForm138] = useState({
        caseNo: "",
        filingDate: "",
        courtName: "",
        caseName: "",
        chequeAmount: "",
        balance: "",
        previousDate: "",
        nextDate: "",
        advocate: "",
        accusedBail: "",
        status: "",
    });

    const [cases138, setCases138] = useState([]);

    const handleChange138 = (e) => {
        setForm138({ ...form138, [e.target.name]: e.target.value });
    };

    const handleSubmit138 = (e) => {
        e.preventDefault();
        setCases138([...cases138, form138]);
        setForm138({
            caseNo: "",
            filingDate: "",
            courtName: "",
            caseName: "",
            chequeAmount: "",
            balance: "",
            previousDate: "",
            nextDate: "",
            advocate: "",
            accusedBail: "",
            status: "",
        });
    };

    // RCS Case Form State
    const [formRCS, setFormRCS] = useState({
        borrowerName: "",
        address: "",
        pan: "",
        aadhar: "",
        mobile: "",
        email: "",
        rcsCaseNo: "",
        balance: "",
        guarantors: "",
        rcsFiled: "",
        awardDate: "",
        awardAmount: "",
        govtStatus: "",
        salaryAttachment: "",
        recoveryStatus: "",
    });

    const handleChangeRCS = (e) => {
        setFormRCS({ ...formRCS, [e.target.name]: e.target.value });
    };

    const handleSubmitRCS = (e) => {
        e.preventDefault();
        console.log("RCS Form Data:", formRCS);
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" mt={4}>
                <ToggleButtonGroup
                    value={activeForm}
                    exclusive
                    onChange={(e, newForm) => {
                        if (newForm !== null) setActiveForm(newForm);
                    }}
                >
                    <ToggleButton value="138">Section 138 Case</ToggleButton>
                    <ToggleButton value="RCS">RCS Case</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {activeForm === "138" && (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        DETAILS OF CASE UNDER SECTION 138
                    </Typography>

                    <form onSubmit={handleSubmit138}>
                        <Grid container spacing={2}>
                            {[
                                { label: "Case No.", name: "caseNo" },
                                { label: "Date of Filing", name: "filingDate", type: "date" },
                                { label: "Court Name & No.", name: "courtName" },
                                { label: "Case Name", name: "caseName" },
                                { label: "Cheque Amount", name: "chequeAmount", type: "number" },
                                { label: "Balance (as on 31.05.23)", name: "balance", type: "number" },
                                { label: "Previous Date", name: "previousDate", type: "date" },
                                { label: "Next Date", name: "nextDate", type: "date" },
                            ].map((field, idx) => (
                                <React.Fragment key={idx}>
                                    <Grid item xs={4}>
                                        <Typography>{field.label}</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            fullWidth
                                            name={field.name}
                                            type={field.type || "text"}
                                            value={form138[field.name]}
                                            onChange={handleChange138}
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{ shrink: field.type === "date" }}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}

                            <Grid item xs={4}>
                                <Typography>Advocate</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    select
                                    fullWidth
                                    name="advocate"
                                    value={form138.advocate}
                                    onChange={handleChange138}
                                    variant="outlined"
                                    size="small"
                                >
                                    <MenuItem value="Petitioner">Petitioner</MenuItem>
                                    <MenuItem value="Respondent">Respondent</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>Accused Bail/Reason</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    name="accusedBail"
                                    value={form138.accusedBail}
                                    onChange={handleChange138}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>Present Status</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    select
                                    fullWidth
                                    name="status"
                                    value={form138.status}
                                    onChange={handleChange138}
                                    variant="outlined"
                                    size="small"
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Disposed">Disposed</MenuItem>
                                    <MenuItem value="Appealed">Appealed</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Box textAlign="center" mt={4}>
                            <Button type="submit" variant="contained">
                                Save Case
                            </Button>
                        </Box>
                    </form>
                </Paper>
            )}

            {activeForm === "RCS" && (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        DETAILS OF RCS CASE
                    </Typography>

                    <form onSubmit={handleSubmitRCS}>
                        <Grid container spacing={2}>
                            {[
                                { label: "Name of Borrower & Membership No.", name: "borrowerName" },
                                { label: "Address", name: "address" },
                                { label: "PAN", name: "pan" },
                                { label: "Aadhar", name: "aadhar" },
                                { label: "Mobile", name: "mobile" },
                                { label: "Email", name: "email" },
                                { label: "RCS Case No.", name: "rcsCaseNo" },
                                { label: "Balance as on (31.05.23)", name: "balance", type: "number" },
                                { label: "Guarantors' Name & M.No.", name: "guarantors" },
                                { label: "RCS Filed & Degree?", name: "rcsFiled" },
                                { label: "Date of Award/Degree", name: "awardDate", type: "date" },
                                { label: "Amount of Award", name: "awardAmount", type: "number" },
                                { label: "Govt. Employee Status", name: "govtStatus" },
                            ].map((field, idx) => (
                                <React.Fragment key={idx}>
                                    <Grid item xs={4}>
                                        <Typography>{field.label}</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            fullWidth
                                            name={field.name}
                                            type={field.type || "text"}
                                            value={formRCS[field.name]}
                                            onChange={handleChangeRCS}
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{ shrink: field.type === "date" }}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}

                            <Grid item xs={4}>
                                <Typography>Salary Attachment or Reason</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    name="salaryAttachment"
                                    value={formRCS.salaryAttachment}
                                    onChange={handleChangeRCS}
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>Present Status of Recovery</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    name="recoveryStatus"
                                    value={formRCS.recoveryStatus}
                                    onChange={handleChangeRCS}
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>

                        <Box textAlign="center" mt={4}>
                            <Button type="submit" variant="contained">
                                Save RCS Case
                            </Button>
                        </Box>
                    </form>
                </Paper>
            )}

            {/* Optional: Table to show saved Section 138 Cases */}
            {cases138.length > 0 && activeForm === "138" && (
                <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Saved Section 138 Cases
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Case No.</TableCell>
                                <TableCell>Case Name</TableCell>
                                <TableCell>Court</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cases138.map((c, index) => (
                                <TableRow key={index}>
                                    <TableCell>{c.caseNo}</TableCell>
                                    <TableCell>{c.caseName}</TableCell>
                                    <TableCell>{c.courtName}</TableCell>
                                    <TableCell>{c.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
}