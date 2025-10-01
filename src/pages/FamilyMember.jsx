// src/pages/FamilyDetailsWow.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Collapse,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Divider,
} from "@mui/material";
import { ExpandMore, Add, Remove, FamilyRestroom } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import memberData from "../../public/Member.json"; // Import your JSON file

export default function FamilyDetailsWow() {
    const steps = ["Borrower Info", "Family Members", "Society / Loan", "Review"];

    const [activeStep, setActiveStep] = useState(0);
    const [expanded, setExpanded] = useState(null);
    const [members, setMembers] = useState([]);

    const [formData, setFormData] = useState({
        borrowerName: "",
        mobile: "",
        fatherSpouse: "",
        fatherMobile: "",
        fatherEmail: "",
        mother: "",
        children: [],
        brothers: [],
        sisters: [],
        familyMemberSociety: "",
        societyDetails: "",
        familyMemberLoan: "",
        loanDetails: "",
    });

    useEffect(() => {
        setMembers(memberData); // Load borrowers from JSON
    }, []);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Auto-fill mobile when borrower is selected
    const handleBorrowerSelect = (memberId) => {
        const member = members.find((m) => m.memberId === memberId);
        if (member) {
            setFormData({
                ...formData,
                borrowerName: member.name,
                mobile: member.mobile || "",
            });
        }
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addMember = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const removeMember = (field, index) => {
        const updated = [...formData[field]];
        updated.splice(index, 1);
        setFormData({ ...formData, [field]: updated });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const toggleExpand = (section) => setExpanded(expanded === section ? null : section);

    const handleSubmit = () => {
        console.log("✅ Submitted Data:", formData);
        alert("Form Submitted Successfully!");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 5,
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    {/* Form Header */}
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3, gap: 1 }}>
                        <FamilyRestroom color="primary" fontSize="large" />
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 600,
                                borderBottom: "2px solid #1976d2",
                                pb: 1,
                            }}
                        >
                            Family Member Detail
                        </Typography>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Animated Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Step 1: Borrower Info */}
                            {activeStep === 0 && (
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Borrower Name</InputLabel>
                                            <Select
                                                value={members.find((m) => m.name === formData.borrowerName)?.memberId || ""}
                                                onChange={(e) => handleBorrowerSelect(e.target.value)}
                                            >
                                                {members.map((m) => (
                                                    <MenuItem key={m.memberId} value={m.memberId}>
                                                        {m.name} ({m.memberId})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Mobile Number"
                                            fullWidth
                                            value={formData.mobile}
                                            onChange={(e) => handleChange("mobile", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {/* Step 2: Family Members */}
                            {activeStep === 1 && (
                                <Box>
                                    {/* Father / Spouse */}
                                    <Card sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">Father / Spouse</Typography>
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Name"
                                                        fullWidth
                                                        value={formData.fatherSpouse}
                                                        onChange={(e) =>
                                                            handleChange("fatherSpouse", e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Mobile"
                                                        fullWidth
                                                        value={formData.fatherMobile}
                                                        onChange={(e) =>
                                                            handleChange("fatherMobile", e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Email"
                                                        fullWidth
                                                        value={formData.fatherEmail}
                                                        onChange={(e) =>
                                                            handleChange("fatherEmail", e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Mother */}
                                    <Card sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">Mother</Typography>
                                            <TextField
                                                label="Mother’s Name"
                                                fullWidth
                                                value={formData.mother}
                                                onChange={(e) => handleChange("mother", e.target.value)}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Expandable Sections */}
                                    {["children", "brothers", "sisters"].map((field, i) => (
                                        <Card key={field} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    onClick={() => toggleExpand(field)}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    <Typography variant="h6">
                                                        {i === 0
                                                            ? "Children"
                                                            : i === 1
                                                                ? "Brothers"
                                                                : "Sisters"}
                                                    </Typography>
                                                    <IconButton>
                                                        <ExpandMore
                                                            sx={{
                                                                transform:
                                                                    expanded === field
                                                                        ? "rotate(180deg)"
                                                                        : "rotate(0)",
                                                                transition: "0.3s",
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                <Collapse in={expanded === field} timeout="auto">
                                                    <Box sx={{ mt: 2 }}>
                                                        {formData[field].map((val, idx) => (
                                                            <Box
                                                                key={idx}
                                                                display="flex"
                                                                alignItems="center"
                                                                gap={1}
                                                                sx={{ mb: 1 }}
                                                            >
                                                                <TextField
                                                                    label={`${field.slice(0, -1)} ${idx + 1}`}
                                                                    fullWidth
                                                                    value={val}
                                                                    onChange={(e) =>
                                                                        handleArrayChange(field, idx, e.target.value)
                                                                    }
                                                                />
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => removeMember(field, idx)}
                                                                >
                                                                    <Remove />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Add />}
                                                            onClick={() => addMember(field)}
                                                        >
                                                            Add {field.slice(0, -1)}
                                                        </Button>
                                                    </Box>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            )}

                            {/* Step 3: Society / Loan */}
                            {activeStep === 2 && (
                                <Box>
                                    <Card sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">Family Member Society Membership</Typography>
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel>Yes / No</InputLabel>
                                                <Select
                                                    value={formData.familyMemberSociety}
                                                    onChange={(e) =>
                                                        handleChange("familyMemberSociety", e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formData.familyMemberSociety === "Yes" && (
                                                <TextField
                                                    label="Membership Details"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                    value={formData.societyDetails}
                                                    onChange={(e) =>
                                                        handleChange("societyDetails", e.target.value)
                                                    }
                                                />
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Family Member Loan from Society</Typography>
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel>Yes / No</InputLabel>
                                                <Select
                                                    value={formData.familyMemberLoan}
                                                    onChange={(e) =>
                                                        handleChange("familyMemberLoan", e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formData.familyMemberLoan === "Yes" && (
                                                <TextField
                                                    label="Loan Details"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                    value={formData.loanDetails}
                                                    onChange={(e) =>
                                                        handleChange("loanDetails", e.target.value)
                                                    }
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}

                            {/* Step 4: Review */}
                            {activeStep === 3 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Review Your Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2">Borrower Name</Typography>
                                                    <Typography>{formData.borrowerName}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2">Mobile</Typography>
                                                    <Typography>{formData.mobile}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2">Father / Spouse</Typography>
                                                    <Typography>{formData.fatherSpouse}</Typography>
                                                    <Typography>{formData.fatherMobile}</Typography>
                                                    <Typography>{formData.fatherEmail}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2">Mother</Typography>
                                                    <Typography>{formData.mother}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    {["children", "brothers", "sisters"].map((field) =>
                                        formData[field].length > 0 ? (
                                            <Box key={field} sx={{ mt: 2 }}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {formData[field].map((val, idx) => (
                                                        <Grid item xs={6} key={idx}>
                                                            <Card>
                                                                <CardContent>
                                                                    <Typography>{val}</Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        ) : null
                                    )}

                                    <Box sx={{ mt: 2 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle2">Society Membership</Typography>
                                                <Typography>{formData.familyMemberSociety}</Typography>
                                                <Typography>{formData.societyDetails}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle2">Loan</Typography>
                                                <Typography>{formData.familyMemberLoan}</Typography>
                                                <Typography>{formData.loanDetails}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" onClick={handleSubmit}>
                                Submit
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
