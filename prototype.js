const proposals = {
  A: {
    company: "Northshore Solar Ltd.",
    licence: true,
    wsib: true,
    insurance: true,
    experience: 14,
    price: 238000,
    weeks: 12,
    panel: 25,
    workmanship: 10,
    lead: true,
    crew: true,
    safety: true,
    monitoring: true,
    suspicious: false,
  },
  B: {
    company: "BrightPath Energy Inc.",
    licence: false,
    wsib: true,
    insurance: true,
    experience: 6,
    price: 189500,
    weeks: 10,
    panel: 25,
    workmanship: 5,
    lead: true,
    crew: false,
    safety: false,
    monitoring: false,
    suspicious: false,
  },
  C: {
    company: "Lakeview Renewables Corp.",
    licence: true,
    wsib: true,
    insurance: true,
    experience: 9,
    price: 244000,
    weeks: 14,
    panel: 25,
    workmanship: 10,
    lead: true,
    crew: true,
    safety: false,
    monitoring: false,
    suspicious: true,
  },
  D: {
    company: "Essex Green Power Inc.",
    licence: true,
    wsib: true,
    insurance: true,
    experience: 11,
    price: 231000,
    weeks: null,
    panel: 25,
    workmanship: 10,
    lead: true,
    crew: false,
    safety: true,
    monitoring: false,
    suspicious: false,
  },
  E: {
    company: "SunGrid Contractors Inc.",
    licence: true,
    wsib: true,
    insurance: true,
    experience: 8,
    price: 242500,
    weeks: 13,
    panel: 25,
    workmanship: 12,
    lead: true,
    crew: true,
    safety: true,
    monitoring: true,
    suspicious: false,
  },
};



function scoreProposals() {
  const results = [];

  // 1. Find proposals that meet all mandatory requirements.
  const eligibleProposals = Object.entries(proposals).filter(
    ([, proposal]) =>
      proposal.licence &&
      proposal.wsib &&
      proposal.insurance
  );

  // 2. Calculate scoring benchmarks from eligible proposals.
  const lowestPrice = Math.min(
    ...eligibleProposals.map(([, proposal]) => proposal.price)
  );

  const highestExperience = Math.max(
    ...eligibleProposals.map(([, proposal]) => proposal.experience)
  );

  const highestPanelWarranty = Math.max(
    ...eligibleProposals.map(([, proposal]) => proposal.panel)
  );

  const highestWorkmanshipWarranty = Math.max(
    ...eligibleProposals.map(([, proposal]) => proposal.workmanship)
  );

  const knownTimelines = eligibleProposals
    .map(([, proposal]) => proposal.weeks)
    .filter((weeks) => weeks !== null);

  const fastestTimeline = Math.min(...knownTimelines);

  // 3. Calculate each proposal's score.
  for (const [proposalId, proposal] of Object.entries(proposals)) {
    // Exclude proposals that fail mandatory requirements.
    if (
      !proposal.licence ||
      !proposal.wsib ||
      !proposal.insurance
    ) {
      results.push({
        proposal: proposalId,
        rank: null,
        status: "ineligible",
        score: null,
        reason: "Fails a mandatory criterion.",
      });

      continue;
    }

    // Calculate experience score.
    const experienceScore =
      (proposal.experience / highestExperience) * 100;

    // Calculate price score.
    const priceScore =
      ((260000 - proposal.price) / (260000 - lowestPrice)) * 100;

    // Calculate timeline score. Missing timelines receive zero.
    const timelineScore =
      proposal.weeks === null
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              ((16 - proposal.weeks) / (16 - fastestTimeline)) * 100
            )
          );

    // Calculate panel warranty score using the highest eligible value.
    const panelWarrantyScore =
      (proposal.panel / highestPanelWarranty) * 100;

    // Calculate workmanship warranty score using the highest eligible value.
    const workmanshipWarrantyScore =
      (proposal.workmanship / highestWorkmanshipWarranty) * 100;

    // Average both warranty scores.
    const warrantyScore =
      (panelWarrantyScore + workmanshipWarrantyScore) / 2;

    // Calculate team score based on four team criteria.
    const teamCriteria = [
      proposal.lead,
      proposal.crew,
      proposal.safety,
      proposal.monitoring,
    ];

    const teamScore =
      (teamCriteria.filter(Boolean).length / teamCriteria.length) * 100;

    // Calculate the final weighted score.
    const totalScore = Number((
      experienceScore * 0.30 +
      priceScore * 0.25 +
      timelineScore * 0.15 +
      warrantyScore * 0.15 +
      teamScore * 0.15
    ).toFixed(2));

    // Flag suspicious proposals for human review.
    const status = proposal.suspicious ? "flagged" : "ranked";

    // Return only the five required fields.
    results.push({
      proposal: proposalId,
      rank: null,
      status,
      score: totalScore,
      reason: proposal.suspicious
        ? "Requires human review before final ranking."
        : "Score calculated using fixed weighted rules.",
    });
  }

  // 4. Rank only proposals that are not flagged or ineligible.
  const rankedProposals = results
    .filter((result) => result.status === "ranked")
    .sort((first, second) => second.score - first.score);

  rankedProposals.forEach((proposal, index) => {
    proposal.rank = index + 1;
  });

  // 5. Return ranked proposals first, followed by flagged
  // and ineligible proposals. Keep exactly five fields per result.
  return results.sort((first, second) => {
    const priority = {
      ranked: 0,
      flagged: 1,
      ineligible: 2,
    };

    if (priority[first.status] !== priority[second.status]) {
      return priority[first.status] - priority[second.status];
    }

    if (first.rank !== null && second.rank !== null) {
      return first.rank - second.rank;
    }

    return first.proposal.localeCompare(second.proposal);
  });
}

// Print only the required output fields as JSON.
console.log(JSON.stringify(scoreProposals(), null, 2));