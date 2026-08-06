const fs = require('fs');
const file = '/home/erpadmin/bench-GMCv15/apps/healthcare-frontend/src/components/OpdInfo/Opdinfo.tsx';
let content = fs.readFileSync(file, 'utf8');

const effectCode = `
    // Auto-select hospital when branches load if a patient with hospitalId is already selected
    useEffect(() => {
        if (editedPatient.hospitalId && branches.length > 0 && setSelectedBranch && !selectedBranch) {
            const matchingBranch = branches.find(b => b.custom_hospital_id === editedPatient.hospitalId);
            if (matchingBranch) {
                setSelectedBranch(matchingBranch.value);
            }
        }
    }, [editedPatient.hospitalId, branches, setSelectedBranch, selectedBranch]);
`;

// Insert it right before the return statement of OpdCard
content = content.replace('    return (\n        <Dialog open={open}', effectCode + '\n    return (\n        <Dialog open={open}');
fs.writeFileSync(file, content);
