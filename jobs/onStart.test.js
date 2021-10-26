const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();
const realTimeDb = admin.database();
const Portfolio = require('../models/portfolio');


const getPortfolios = async (id) => {
    const portfolioRef = db.collection('portfolios');
    const portfolioArray = [];
    let snapshot = null;

    snapshot = await portfolioRef.where('challengeId', '==', id).orderBy('submitTimestamp', 'desc').get();
    if (snapshot.empty) {
        try {
            console.log(`No Porfolios found for challenge ${id}`);
        } catch (error) {
            console.error(`getPortfolios`, error);
        }
    } else {
        snapshot.forEach(doc => {
            const portfolio = new Portfolio(
                doc.id,
                doc.data().userId,
                doc.data().username,
                doc.data().challengeId,
                doc.data().stocks,
                doc.data().submitTimestamp,
            );
            portfolioArray.push(portfolio);
        });
        return (portfolioArray);
    };
}

const saveToRTDb = (id, l) => {
    const ref = realTimeDb.ref('Leaderboard');
    const leaderboardRef = ref.child(id);
    leaderboardRef.set({ l });
}

let leaderboard = [];
getPortfolios('e3626ca7-f179-4f2e-bd44-a9a769dc10b3')
    .then(data => {
        const portfolios = data;
        console.log(`fetched Portfolios`);
        console.table(portfolios);
        console.log(`\n`);
        for (let p = 0; p < portfolios.length; p++) {

            const l = {
                avgReturn: 0,
                rank: 0,
                changeInPosition: 0,
                portfolioId: portfolios[p].id,
                username: portfolios[p].username,
                submitTimestamp: portfolios[p].submitTimestamp
            }
            leaderboard.push(l);
        }
        saveToRTDb("svn1on0i", leaderboard);

    }, error =>{
        console.error(error);
    }
    );
