

d1 = range(-7,7)
d2 = range(-7,7)

Combos = []

for x in range(-7,7):
    print(x)
    Combos.append(str(x)+':0')
    Combos.append('0:'+str(x))

    Combos.append(str(x)+':'+str(x))
    Combos.append(str(x)+':'+str(-x))


Grid = [['# ' for y in range (8)] for x in range(8)]

def AlterPos(Vect):
    x,y=Vect.split(':')

    DPos = [7,7]
    DPos[0] += int(x)
    DPos[1] += int(y)
    return DPos

for Vec in Combos: 
    NewPos = AlterPos(Vec)
    if NewPos[1] < len(Grid) and NewPos[1] > -1 and NewPos[0] > -1 and NewPos[0] < len(Grid[0]):
        Grid[NewPos[1]][NewPos[0]] = 'X '

for x in Grid: print(''.join(x))
print('-'*15)
