import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react'

const Icon = ({ name, size, color }) => (
    <FontAwesome5 name={name} size={size} color={color} />
)

export default Icon