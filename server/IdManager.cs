public class IdManager
{
    private ulong currentId = 0;

    public ulong CreateNewId() => currentId++;
}