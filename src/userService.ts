import {User} from "../models"

export function create(cboId: string, email: string) {
    return User.create({cboId, email})
}
export async function findById(cboId: string) {
    try {
        const response = await User.findOne({ where: { cboId }});
        return response;
    } catch (error) {
        console.error(error);
    }
}
