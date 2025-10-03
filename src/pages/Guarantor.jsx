
import React, { useState, useEffect } from "react";
import {
    Box, TextField, Button, MenuItem, Dialog, DialogContent, DialogTitle,
    Stepper, Step, StepLabel, Typography, Grid, InputAdornment, IconButton,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Snackbar, Alert
} from "@mui/material";
import { Search, Clear, Close } from "@mui/icons-material";

const steps = [
    "Personal Information", "Contact & References", "Documents",
    "Bank Details", "Guarantee Details", "Preview & Submit"
];

// CONFIG
const fieldConfig = {
    0: [
        { name: "name", label: "Name of Guarantor" },
        { name: "fatherName", label: "Father's Name" },
        { name: "motherName", label: "Mother's Name" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "age", label: "Age in Years", type: "number" },
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
        { name: "maritalStatus", label: "Marital Status", type: "select", options: ["Married", "Unmarried", "Divorced", "Widowed"] },
        { name: "membershipId", label: "Membership ID", helper: "Enter membership id if any" },
        { name: "membershipDate", label: "Membership Date", type: "date" },
        { name: "qualification", label: "Qualification (if professional, mention institute name)" },
        { name: "familyMemberSociety", label: "Any family member in society? (if yes, mention name & membership no.)", full: true },
        { name: "creditAmount", label: "Amount in credit as on (31.05.2025)", type: "number" },
        { name: "referenceName", label: "Reference Name" },
        { name: "referenceNumber", label: "Reference Contact No." },
    ],
    1: [
        { name: "mobile", label: "Mobile / Landline No." },
        { name: "email", label: "Email" },
        { name: "permanentAddress", label: "Permanent Address", full: true },
        { name: "currentAddress", label: "Current Residential Address", full: true },
        { name: "witnessName", label: "Witness Name" },
        { name: "witnessNumber", label: "Witness Contact No." },
        { name: "staffReference", label: "Staff Reference (if any)" },
        { name: "otherFamilyContact", label: "Any other family contact no." },
    ],
    2: [
        { name: "pan", label: "PAN No." },
        { name: "aadhar", label: "Aadhar No." },
        { name: "passport", label: "Passport No." },
        { name: "rationOrDL", label: "Ration Card / Driving License" },
        { name: "photo", label: "Upload Passport Size Photo", type: "file", full: true },
    ],
    3: [
        { name: "bankName", label: "Bank Name" },
        { name: "branch", label: "Branch" },
        { name: "accountNo", label: "Account Number" },
        { name: "ifsc", label: "IFSC Code" },
        { name: "chequeCopy", label: "Upload Attached Cheque Copy", type: "file", full: true },
        { name: "passbook", label: "Upload Passbook Copy", type: "file", full: true },
    ]
};

// FIELD RENDERER
function RenderFields({ fields, formData, handleChange, handleFileChange, previews, errors }) {
    return (
        <Grid container spacing={2}>
            {fields.map((f) => (
                <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                    {f.type === "select" ? (
                        <TextField select label={f.label} fullWidth value={formData[f.name] || ""}
                            onChange={(e) => handleChange(f.name, e.target.value)}>
                            <MenuItem value="">Select</MenuItem>
                            {f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </TextField>
                    ) : f.type === "file" ? (
                        <Box>
                            <Button variant="contained" component="label">{f.label}
                                <input hidden accept="image/*" type="file" onChange={(e) => handleFileChange(f.name, e)} />
                            </Button>
                            {previews[f.name] && <Box mt={1}><img src={previews[f.name]} alt="preview" width={120} /></Box>}
                        </Box>
                    ) : (
                        <TextField
                            type={f.type || "text"} label={f.label} fullWidth
                            InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                            value={formData[f.name] || ""} helperText={errors[f.name] || f.helper || ""}
                            error={Boolean(errors[f.name])}
                            onChange={(e) => handleChange(f.name, e.target.value)}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    );
}

// MAIN COMPONENT 
export default function Guarantor() {
    const [members, setMembers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setForm] = useState({});
    const [previews, setPreviews] = useState({});
    const [selected, setSelected] = useState(null);
    const [snack, setSnack] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch("/Member.json").then(r => r.json()).then(d => {
            const arr = Array.isArray(d) ? d : d.members || [];
            setMembers(arr); setFiltered(arr);
        }).catch(() => { setMembers([]); setFiltered([]); });
    }, []);

    useEffect(() => {
        let res = members.filter(m => {
            const q = search.toLowerCase();
            return !q || Object.values(m).join(" ").toLowerCase().includes(q);
        });
        if (status) res = res.filter(m => (m.status || "").toLowerCase() === status.toLowerCase());
        setFiltered(res);
    }, [search, status, members]);

    const handleChange = (f, v) => {
        setForm(p => ({ ...p, [f]: v }));

        //  Auto-fill Membership ID logic
        if (f === "membershipId") {
            const member = members.find(m => String(m.memberId) === String(v));
            if (!member && v) {
                setErrors(p => ({ ...p, membershipId: "No member found with this Membership ID" }));
            } else if (member) {
                setErrors(p => ({ ...p, membershipId: "" }));
                setForm(p => ({
                    ...p,
                    membershipId: member.memberId,
                    name: member.name,
                    dob: member.dob,
                    email: member.email,
                    mobile: member.mobile,
                    permanentAddress: `${member.address.street}, ${member.address.city}, ${member.address.state} - ${member.address.pincode}, ${member.address.country}`,
                    pan: member.kyc?.pan || "",
                    aadhar: member.kyc?.aadhar || ""
                }));
            } else {
                setErrors(p => ({ ...p, membershipId: "" }));
            }
        }
    };

    const handleFileChange = (field, e) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(p => ({ ...p, [field]: file }));
            setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
        }
    };

    const submit = () => {
        console.log(formData);
        setSnack(true);
        setOpen(false);
        setStep(0);
        setForm({});
        setPreviews({});
        setSelected(null);
    };

    const renderStep = () => {
        if (fieldConfig[step])
            return <RenderFields fields={fieldConfig[step]} formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} previews={previews} errors={errors} />;

        if (step === 4) return (
            <Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>28. Guarantor has given guarantee in other loans (outside society)?</FormLabel>
                    <RadioGroup row value={formData.givenGuaranteeOther ? "yes" : "no"}
                        onChange={(e) => handleChange("givenGuaranteeOther", e.target.value === "yes")}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {formData.givenGuaranteeOther && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Society Name" fullWidth value={formData.otherSocietyName || ""}
                                onChange={(e) => handleChange("otherSocietyName", e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount of Guarantee" type="number" fullWidth value={formData.otherGuaranteeAmount || ""}
                                onChange={(e) => handleChange("otherGuaranteeAmount", e.target.value)} />
                        </Grid>
                    </Grid>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>29. Guarantor has given guarantee in our society?</FormLabel>
                    <RadioGroup row value={formData.givenGuaranteeOur ? "yes" : "no"}
                        onChange={(e) => handleChange("givenGuaranteeOur", e.target.value === "yes")}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {formData.givenGuaranteeOur && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Member Name" fullWidth value={formData.ourMemberName || ""}
                                onChange={(e) => handleChange("ourMemberName", e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Membership No." fullWidth value={formData.ourMembershipNo || ""}
                                onChange={(e) => handleChange("ourMembershipNo", e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Amount of Loan" type="number" fullWidth value={formData.ourLoanAmount || ""}
                                onChange={(e) => handleChange("ourLoanAmount", e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select label="Regular / Irregular" fullWidth value={formData.loanStatus || ""}
                                onChange={(e) => handleChange("loanStatus", e.target.value)}>
                                <MenuItem value="regular">Regular</MenuItem>
                                <MenuItem value="irregular">Irregular</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Since When" type="date" fullWidth InputLabelProps={{ shrink: true }}
                                value={formData.loanSince || ""} onChange={(e) => handleChange("loanSince", e.target.value)} />
                        </Grid>
                    </Grid>
                )}
            </Box>
        );

        if (step === 5) return (
            <Box>
                <Typography variant="h6">Preview</Typography>
                <pre style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(formData, null, 2)}</pre>
                <Button onClick={submit} variant="contained">Confirm & Submit</Button>
            </Box>
        );
    };

    return (
        <Box p={2}>
            {/* Search / Filter / Add */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth placeholder="Search Id and Member Name..." value={search} onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            endAdornment: search && <InputAdornment position="end"><IconButton onClick={() => setSearch("")}><Clear /></IconButton></InputAdornment>
                        }} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField select fullWidth label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6} md={3}><Button variant="contained" onClick={() => setOpen(true)}>Add Guarantor</Button></Grid>
            </Grid>

            {/* Member List */}
            <Box mt={2}>
                {filtered.map((m, i) => (
                    <Box key={i} p={1} mb={1} border="1px solid #ccc" borderRadius="8px"
                        onClick={() => setSelected(m)} sx={{ cursor: "pointer", background: selected === m ? "#e3f2fd" : "white" }}>
                        <Typography>{m.name}</Typography>
                        <Typography variant="body2">Membership No: {m.memberId}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Add Guarantor <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={step} alternativeLabel>{steps.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}</Stepper>
                    <Box mt={2}>{renderStep()}</Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
                        <Button onClick={() => step === steps.length - 1 ? submit() : setStep(step + 1)} variant="contained"
                            disabled={step === 0 && Boolean(errors.membershipId)}>
                            {step === steps.length - 1 ? "Submit" : "Next"}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Notification */}
            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
                <Alert onClose={() => setSnack(false)} severity="success" sx={{ width: "100%" }}>
                    Guarantor Generated Successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

