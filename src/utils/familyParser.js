// src/utils/familyParser.js
export function groupMembersByFamily(membersList = []) {
  const families = {};

  membersList.forEach((member) => {
    const famId = member.family_id || member.id;
    if (!families[famId]) {
      families[famId] = {
        familyId: famId,
        head: null,
        members: []
      };
    }

    if (member.household_role === 'Head of Family') {
      families[famId].head = member;
    } else {
      families[famId].members.push(member);
    }
  });

  return Object.values(families);
}