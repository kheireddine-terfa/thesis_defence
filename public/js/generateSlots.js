const moment = require('moment');

function generateSessionSlots(session) {
    const slots = [];

    const startDate = moment(session.startSession);
    const endDate = moment(session.endSession);

    // Parcourir tous les jours entre la date de début et la date de fin
    for (let date = startDate; date.isBefore(endDate); date.add(1, 'day')) {
        // Exclure les vendredis
        if (date.isoWeekday() !== 5 && date.isoWeekday() !== 6) { // 5 et 6 correspond au vendredi
            const dayStartTime = moment(`${date.format('YYYY-MM-DD')}T${session.startDayHour}`);
            const dayEndTime = moment(`${date.format('YYYY-MM-DD')}T${session.endDayHour}`);
            
            // Générer les créneaux horaires pour la journée
            for (let slotStart = moment(dayStartTime); slotStart.isBefore(dayEndTime); slotStart.add(session.thesisDefenceDuration + session.break, 'minutes')) {
                const slotEnd = moment(slotStart).add(session.thesisDefenceDuration, 'minutes');
                
                // Vérifier si le créneau ne dépasse pas l'heure de fin de la journée
                if (slotEnd.isBefore(dayEndTime)) {
                    slots.push({
                        date: date.format('YYYY-MM-DD'),
                        heuredeb: slotStart.format('HH:mm'),
                        heurefin: slotEnd.format('HH:mm')
                    });
                }
            }
        }
    }

    return slots;
}

// Exemple d'utilisation avec les paramètres de session
const session = {
    startSession: '2024-05-01',
    endSession: '2024-05-15',
    startDayHour: '09:00',
    endDayHour: '17:00',
    thesisDefenceDuration: 90,
    break: 10
};

const slots = generateSessionSlots(session);
console.log(slots);
console.log(slots.length);
